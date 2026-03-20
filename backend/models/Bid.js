const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
    amount: { type: Number, required: true, min: 0 },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", bidSchema);
