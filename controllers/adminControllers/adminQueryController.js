const asyncHandler = require("express-async-handler");
const User = require("../../models/userModel");
const Transaction = require("../../models/transactionModel");

// @desc    Get All Transactions
// @route   GET /admin/transaction?pageNumber=1
// @access  authenticated/admin
exports.getAllTransactions = asyncHandler(async (req, res) => {
  // 1) how many transactions to display per page
  const pageSize = 10;

  // 2) get the current page from the query params
  const page = Number(req.query.pageNumber) || 1;

  // 3) get the total number of transactions
  const totalTransactions = await Transaction.find().countDocuments();

  // 4) get the total number of pages
  const totalPages = Math.ceil(totalTransactions / pageSize);

  // 5) get the transactions for the current page
  const transactions = await Transaction.find({})
    .select("_id from to amount date") // select only the fields we need, for better performance
    .populate("from", "name mobile")
    .populate("to", "name mobile")
    .sort({ date: -1 }) // sort by date in descending order
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // 6) send the response
  res.send({
    pageSize,
    numOfTransactions: totalTransactions,
    numOfPages: totalPages,
    transactions,
  });
});
