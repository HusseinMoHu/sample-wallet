const express = require("express");

// 1) Routers
const userMainRouter = require("./userMainRouter");
const transactionMainRouter = require("./transactionMainRouter");
const adminMainRouter = require("./adminMainRouter");

// 2) Express Router
const router = express.Router();

// 3) Routes
router.use("/user", userMainRouter);
router.use("/transaction", transactionMainRouter);
router.use("/admin", adminMainRouter);

// 4) Export router
module.exports = router;
