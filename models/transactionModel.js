const mongoose = require("mongoose");

// 1) Create transaction schema
const transactionSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "is required"],
      ref: "User",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "is required"],
      ref: "User",
    },
    amount: { type: Number, required: [true, "is required"] },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// 2) Create transaction model
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
