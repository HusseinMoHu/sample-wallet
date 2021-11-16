const express = require("express");
const router = express.Router();

// 1) Importing the transaction controller
const { protect } = require("../middleware/authMiddleware");
const transactionController = require("../controllers/transactionControllers/transactionController");
const transactionQueryController = require("../controllers/transactionControllers/transactionQueryController");

// 2) Defining the routes
router.post("/", protect, transactionController.createTransaction);

// 3) Export the router
module.exports = router;
