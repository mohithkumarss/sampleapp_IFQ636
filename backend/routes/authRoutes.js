const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
} = require("../controllers/authController");

// 1. Import the protect middleware
const { protect } = require("../middleware/authMiddleware");

// Public (Anyone can access)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private (ONLY users with a valid token can access)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
