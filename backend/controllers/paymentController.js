const Auction = require("../models/Auction");
const Transaction = require("../models/Transaction");
const asyncHandler = require("../utils/asyncHandler");

const makeReferenceId = () => `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const mockPayment = asyncHandler(async (req, res) => {
  const { auctionId, amount, paymentMethod = "mock-card", forceStatus } = req.body;
  if (!auctionId || amount === undefined) {
    res.status(400);
    throw new Error("auctionId and amount are required");
  }

  const auction = await Auction.findById(auctionId);
  if (!auction) {
    res.status(404);
    throw new Error("Auction not found");
  }

  const status =
    forceStatus === "success" || forceStatus === "failed"
      ? forceStatus
      : Math.random() > 0.2
      ? "success"
      : "failed";

  const transaction = await Transaction.create({
    user: req.user._id,
    auction: auction._id,
    amount: Number(amount),
    paymentMethod,
    status,
    message:
      status === "success"
        ? "Payment authorized for auction settlement."
        : "Payment declined by mock gateway.",
    referenceId: makeReferenceId(),
  });

  res.status(status === "success" ? 200 : 402).json({
    message: transaction.message,
    transaction,
  });
});

const getMyTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .populate("auction", "number type")
    .sort({ createdAt: -1 });
  res.json({ count: transactions.length, transactions });
});

const getAllTransactionsAdmin = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
  const skip = (page - 1) * limit;

  const [total, transactions] = await Promise.all([
    Transaction.countDocuments(),
    Transaction.find()
      .populate("user", "name email role")
      .populate("auction", "number type status endTime price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  res.json({
    count: transactions.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    transactions,
  });
});

module.exports = { mockPayment, getMyTransactions, getAllTransactionsAdmin };
