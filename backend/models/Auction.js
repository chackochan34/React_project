const mongoose = require("mongoose");

const indianPlateRegex = /^(?:[A-Z]{2}|BH)\s\d{1,2}\s[A-Z]{1,3}\s\d{4}$/;

const auctionSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      match: [indianPlateRegex, "Invalid Indian number plate format. Use e.g. MH 01 AB 0001"],
    },
    type: {
      type: String,
      enum: ["Fancy", "VIP", "Trending", "Normal", "Cheap", "Premium", "Celebrity", "Lucky"],
      required: true,
      default: "Fancy",
    },
    price: { type: Number, required: true, min: 0 },
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
    status: {
      type: String,
      enum: ["ongoing", "upcoming", "completed"],
      default: "upcoming",
    },
    endTime: { type: Date, required: true },
    featured: { type: Boolean, default: false },
    description: { type: String, default: "" },
    topBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", auctionSchema);
