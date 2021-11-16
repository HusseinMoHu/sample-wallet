const express = require("express");
const router = express.Router();

// 1) Importing the user controller
const { protect } = require("../middleware/authMiddleware");
const userController = require("../controllers/userControllers/userController");
const userQueryController = require("../controllers/userControllers/userQueryController");

// 2) Defining the routes
router.post("/verify", userController.verifyEmail);
router.post("/login", userController.authUser);

router.post("/forgot/password", userController.forgotPassword);
router.post("/reset/password", protect, userController.resetPassword);
router.post("/change/password", protect, userController.changePassword);
router.post("/otp/resend", userController.resendOtp);
router.post("/", userController.createUser);

// 3) Export the router
module.exports = router;
