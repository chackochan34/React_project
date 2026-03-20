const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["success", "failed"], required: true },
    referenceId: { type: String, required: true, unique: true },
    paymentMethod: { type: String, default: "mock-card" },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
