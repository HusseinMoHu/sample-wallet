const express = require("express");
const router = express.Router();

// 1) Importing the admin controller
const { protect, admin } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminControllers/adminController");
const adminQueryController = require("../controllers/adminControllers/adminQueryController");

// 2) Defining the routes
router.get(
  "/transaction",
  protect,
  admin,
  adminQueryController.getAllTransactions
);
// router.get("/users", protect, admin, adminQueryController.getUsers);
// router.get("/admins", protect, admin, adminQueryController.getAdmins);

// router
//   .route("/users/:id")
//   .delete(protect, admin, adminController.deleteUser)
//   .put(protect, admin, adminController.updateUserById)
//   .get(protect, admin, adminQueryController.getUserById);

// 3) Export the router
module.exports = router;
