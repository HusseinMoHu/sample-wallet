const asyncHandler = require("express-async-handler");
const User = require("../../models/userModel");
const Transaction = require("../../models/transactionModel");

// 1) Import email sending service
const { balanceTransfer } = require("../../emails/account");

// @desc    transfer balance to other users
// @route   POST /transaction
// @access  authenticated
exports.createTransaction = asyncHandler(async (req, res) => {
  const { mobile, amount } = req.body;
  const { _id, balance, name, email } = req.user;

  // 1) Check negative amount, to prevent users form stealing money
  if (amount < 0) {
    res.status(400);
    throw new Error("Amount cannot be negative");
  }

  // 2) Prevent user from transferring more than their balance
  if (amount > 0 && amount > balance) {
    return res.status(400).send({
      message: "Insufficient balance",
      currentBalance: balance,
      amount,
    });
  }

  // 3) User who is receiving the money
  const user = await User.findOne({ mobile }); // select specific fields

  // 4) Check if user exist
  if (user) {
    // 5) Perform the transaction process
    const transaction = await Transaction.create({
      from: req.user._id,
      to: user._id,
      amount,
    });

    // 6) Update the balance of the user who is sending the money
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $inc: { balance: -amount } },
      { new: true } // enforce the return of the updated document
    );

    // 7) Update the balance of the user who is receiving the money
    await User.findByIdAndUpdate(
      user._id,
      { $inc: { balance: amount } }
      // { new: true } // in case we want to get the updated user who is receiving the money
    );

    // 8) Send email to the user who is receiving the money with the transaction details
    balanceTransfer({
      email: user.email,
      type: "received",
      amount,
      transactionId: transaction._id,
      currentBalance: user.balance + amount,
    });

    // 9) Send email to the user who is sending the money with the transaction details
    balanceTransfer({
      email,
      type: "sent",
      amount,
      transactionId: transaction._id,
      currentBalance: balance - amount,
    });

    // 10) Return the transaction details
    res.status(201).send({
      message: "Transaction successful",
      data: {
        transaction: {
          _id: transaction._id,
          amount: transaction.amount,
          date: transaction.date,
          to: user.name,
          from: name,
        },
        currentBalance: updatedUser.balance,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});
