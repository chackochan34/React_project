const { Parser } = require("json2csv");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const Plate = require("../models/Plate");
const Transaction = require("../models/Transaction");
const asyncHandler = require("../utils/asyncHandler");

const allowedTypes = ["Fancy", "VIP", "Trending", "Normal", "Cheap", "Premium", "Celebrity", "Lucky"];

const normalizeType = (value) => {
  if (!value || typeof value !== "string") return value;
  const matched = allowedTypes.find((item) => item.toLowerCase() === value.trim().toLowerCase());
  return matched || value;
};

const getTimeRemainingSeconds = (endTime) => {
  const remainingMs = new Date(endTime).getTime() - Date.now();
  return Math.max(Math.floor(remainingMs / 1000), 0);
};

const makeReferenceId = (prefix = "ADM") => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const logAdminTransaction = async ({ req, auction, amount, message }) => {
  if (!req?.user?._id || !auction?._id) return;

  await Transaction.create({
    user: req.user._id,
    auction: auction._id,
    amount: Number(amount) || 0,
    status: "success",
    paymentMethod: "admin-action",
    message,
    referenceId: makeReferenceId("ADM"),
  });
};

const syncPlateFromAuction = async (auction, options = {}) => {
  const previousNumber = options.previousNumber;
  const upsertFilter = {
    $or: [{ auction: auction._id }, { number: auction.number }],
  };

  if (previousNumber && previousNumber !== auction.number) {
    upsertFilter.$or.push({ number: previousNumber });
  }

  await Plate.findOneAndUpdate(
    upsertFilter,
    {
      $set: {
        auction: auction._id,
        number: auction.number,
        type: auction.type,
        currentPrice: Number(auction.price) || 0,
        status: auction.status,
        description: auction.description || "",
        timeRemaining: getTimeRemainingSeconds(auction.endTime),
        endTime: auction.endTime,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
};

const syncExpiredOngoingAuctions = async () => {
  await Auction.updateMany(
    {
      status: "ongoing",
      endTime: { $lte: new Date() },
    },
    {
      $set: { status: "completed" },
    }
  );

  await Plate.updateMany(
    {
      status: "ongoing",
      endTime: { $lte: new Date() },
    },
    {
      $set: { status: "completed", timeRemaining: 0 },
    }
  );
};

const getAllAuctions = asyncHandler(async (req, res) => {
  await syncExpiredOngoingAuctions();

  const {
    type,
    category,
    status,
    featured,
    search,
    sort = "-createdAt",
    page = 1,
    limit = 48,
  } = req.query;
  const filter = {};

  const selectedType = type || category;
  if (selectedType) filter.type = normalizeType(selectedType);
  if (status) filter.status = status;
  if (featured === "true") filter.featured = true;
  if (search) filter.number = { $regex: search, $options: "i" };

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.min(Math.max(Number(limit) || 48, 1), 100);
  const skip = (parsedPage - 1) * parsedLimit;

  const [total, auctions] = await Promise.all([
    Auction.countDocuments(filter),
    Auction.find(filter)
      .select("number type price status endTime featured description topBidder createdAt")
      .populate("topBidder", "name")
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit),
  ]);

  res.json({
    count: auctions.length,
    total,
    page: parsedPage,
    totalPages: Math.ceil(total / parsedLimit),
    auctions,
  });
});

const getFeaturedAuctions = asyncHandler(async (req, res) => {
  await syncExpiredOngoingAuctions();

  const featuredAuctions = await Auction.find({ featured: true })
    .populate("topBidder", "name")
    .sort({ createdAt: -1 })
    .limit(8);

  res.json({ count: featuredAuctions.length, auctions: featuredAuctions });
});

const getAuctionsByCategory = asyncHandler(async (req, res) => {
  await syncExpiredOngoingAuctions();

  const auctions = await Auction.find({ type: normalizeType(req.params.type) }).sort({ createdAt: -1 });
  res.json({ count: auctions.length, auctions });
});

const getAuctionById = asyncHandler(async (req, res) => {
  await syncExpiredOngoingAuctions();

  const auction = await Auction.findById(req.params.id)
    .populate("topBidder", "name")
    .populate({
      path: "bids",
      options: { sort: { amount: -1 } },
      populate: { path: "user", select: "name email" },
    });

  if (!auction) {
    res.status(404);
    throw new Error("Auction not found");
  }

  res.json(auction);
});

const createAuction = asyncHandler(async (req, res) => {
  const { number, type, price, status, endTime, featured, description } = req.body;

  if (!number || !type || price === undefined || !endTime) {
    res.status(400);
    throw new Error("number, type, price and endTime are required");
  }

  const normalizedType = normalizeType(type);
  if (!allowedTypes.includes(normalizedType)) {
    res.status(400);
    throw new Error(`Invalid type. Allowed: ${allowedTypes.join(", ")}`);
  }

  const auction = await Auction.create({
    number,
    type: normalizedType,
    price,
    status: status || "upcoming",
    endTime,
    featured: !!featured,
    description: description || "",
  });

  await syncPlateFromAuction(auction);
  await logAdminTransaction({
    req,
    auction,
    amount: auction.price,
    message: `Admin created auction for ${auction.number}.`,
  });

  res.status(201).json(auction);
});

const updateAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) {
    res.status(404);
    throw new Error("Auction not found");
  }

  const previousNumber = auction.number;

  const fields = ["number", "type", "price", "status", "endTime", "featured", "description"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      auction[field] = field === "type" ? normalizeType(req.body[field]) : req.body[field];
    }
  });

  const saved = await auction.save();
  await syncPlateFromAuction(saved, { previousNumber });
  await logAdminTransaction({
    req,
    auction: saved,
    amount: saved.price,
    message: `Admin updated auction for ${saved.number}.`,
  });

  res.json(saved);
});

const updateAuctionStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["ongoing", "upcoming", "completed"].includes(status)) {
    res.status(400);
    throw new Error("Status must be one of ongoing, upcoming, completed");
  }

  const auction = await Auction.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!auction) {
    res.status(404);
    throw new Error("Auction not found");
  }

  await syncPlateFromAuction(auction);
  await logAdminTransaction({
    req,
    auction,
    amount: auction.price,
    message: `Admin changed status to ${status} for ${auction.number}.`,
  });

  res.json(auction);
});

const deleteAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) {
    res.status(404);
    throw new Error("Auction not found");
  }

  await logAdminTransaction({
    req,
    auction,
    amount: auction.price,
    message: `Admin deleted auction for ${auction.number}.`,
  });

  await Bid.deleteMany({ auction: auction._id });
  await Plate.deleteMany({ $or: [{ auction: auction._id }, { number: auction.number }] });
  await auction.deleteOne();

  res.json({ message: "Auction deleted successfully" });
});

const exportAuctionsCsv = asyncHandler(async (req, res) => {
  await syncExpiredOngoingAuctions();

  const auctions = await Auction.find().populate("topBidder", "name").lean();
  const fields = [
    { label: "ID", value: "_id" },
    { label: "Number", value: "number" },
    { label: "Type", value: "type" },
    { label: "Price", value: "price" },
    { label: "Status", value: "status" },
    { label: "End Time", value: "endTime" },
    { label: "Featured", value: "featured" },
    { label: "Top Bidder", value: (row) => row.topBidder?.name || "" },
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(auctions);

  res.header("Content-Type", "text/csv");
  res.attachment("auctions-export.csv");
  res.send(csv);
});

module.exports = {
  getAllAuctions,
  getFeaturedAuctions,
  getAuctionsByCategory,
  getAuctionById,
  createAuction,
  updateAuction,
  updateAuctionStatus,
  deleteAuction,
  exportAuctionsCsv,
};
