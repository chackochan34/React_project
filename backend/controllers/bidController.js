const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const Plate = require("../models/Plate");
const asyncHandler = require("../utils/asyncHandler");

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

const buildWinningBidsForUser = async (userId) => {
  await syncExpiredOngoingAuctions();

  const wonAuctions = await Auction.find({
    status: "completed",
    topBidder: userId,
  })
    .select("number type status endTime price")
    .sort({ endTime: -1 })
    .lean();

  if (!wonAuctions.length) return [];

  const auctionIds = wonAuctions.map((auction) => auction._id);
  const userBids = await Bid.find({
    user: userId,
    auction: { $in: auctionIds },
  })
    .sort({ amount: -1, createdAt: -1 })
    .lean();

  const topBidByAuction = new Map();
  userBids.forEach((bid) => {
    const key = String(bid.auction);
    if (!topBidByAuction.has(key)) {
      topBidByAuction.set(key, bid);
    }
  });

  return wonAuctions
    .map((auction) => {
      const bid = topBidByAuction.get(String(auction._id));
      if (!bid) return null;
      return {
        _id: bid._id,
        amount: bid.amount,
        createdAt: bid.createdAt,
        auction,
      };
    })
    .filter(Boolean);
};

const placeBid = asyncHandler(async (req, res) => {
  const { auctionId, amount } = req.body;
  if (!auctionId || amount === undefined) {
    res.status(400);
    throw new Error("auctionId and amount are required");
  }

  const auction = await Auction.findById(auctionId);
  if (!auction) {
    res.status(404);
    throw new Error("Auction not found");
  }

  if (auction.status !== "ongoing") {
    res.status(400);
    throw new Error("Bidding is only available for ongoing auctions");
  }

  if (new Date(auction.endTime).getTime() <= Date.now()) {
    auction.status = "completed";
    await auction.save();
    await Plate.findOneAndUpdate(
      { $or: [{ auction: auction._id }, { number: auction.number }] },
      { $set: { status: "completed", currentPrice: auction.price, timeRemaining: 0, endTime: auction.endTime } }
    );

    res.status(400);
    throw new Error("Auction has ended");
  }

  if (Number(amount) <= Number(auction.price)) {
    res.status(400);
    throw new Error(`Bid must be higher than current price (${auction.price})`);
  }

  const bid = await Bid.create({
    user: req.user._id,
    auction: auction._id,
    amount: Number(amount),
  });

  auction.price = Number(amount);
  auction.topBidder = req.user._id;
  auction.bids.push(bid._id);
  await auction.save();

  await Plate.findOneAndUpdate(
    { $or: [{ auction: auction._id }, { number: auction.number }] },
    {
      $set: {
        currentPrice: auction.price,
        status: auction.status,
        endTime: auction.endTime,
        timeRemaining: Math.max(Math.floor((new Date(auction.endTime).getTime() - Date.now()) / 1000), 0),
      },
      $inc: { bidsCount: 1 },
    }
  );

  const populatedBid = await Bid.findById(bid._id).populate("user", "name email");
  res.status(201).json({ message: "Bid placed successfully", bid: populatedBid });
});

const getBidHistory = asyncHandler(async (req, res) => {
  const { auctionId } = req.params;
  const bids = await Bid.find({ auction: auctionId })
    .populate("user", "name email")
    .sort({ amount: -1, createdAt: -1 });

  res.json({ count: bids.length, bids });
});

const getUserBids = asyncHandler(async (req, res) => {
  if (String(req.query.won || "").toLowerCase() === "true") {
    const bids = await buildWinningBidsForUser(req.user._id);
    res.json({ count: bids.length, bids });
    return;
  }

  const bids = await Bid.find({ user: req.user._id })
    .populate("auction", "number type status endTime price topBidder")
    .sort({ createdAt: -1 });
  res.json({ count: bids.length, bids });
});

const getUserWinningBids = asyncHandler(async (req, res) => {
  const bids = await buildWinningBidsForUser(req.user._id);
  res.json({ count: bids.length, bids });
});

const getAllBidsAdmin = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
  const skip = (page - 1) * limit;

  const [total, bids] = await Promise.all([
    Bid.countDocuments(),
    Bid.find()
      .populate("user", "name email role")
      .populate("auction", "number type status endTime price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  res.json({
    count: bids.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    bids,
  });
});

module.exports = { placeBid, getBidHistory, getUserBids, getUserWinningBids, getAllBidsAdmin };
