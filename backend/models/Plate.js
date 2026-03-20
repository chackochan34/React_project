const mongoose = require("mongoose");

const plateSchema = new mongoose.Schema(
  {
    auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", unique: true, sparse: true },
    number: { type: String, required: true, unique: true, trim: true, uppercase: true },
    type: {
      type: String,
      enum: ["Fancy", "VIP", "Trending", "Normal", "Cheap", "Premium", "Celebrity", "Lucky"],
      required: true,
    },
    currentPrice: { type: Number, required: true, min: 0 },
    bidsCount: { type: Number, default: 0, min: 0 },
    timeRemaining: { type: Number, default: 0, min: 0 },
    endTime: { type: Date, default: null },
    status: { type: String, enum: ["ongoing", "upcoming", "completed"], default: "upcoming" },
    description: { type: String, default: "" },
    image: { type: String, default: null },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plate", plateSchema);
