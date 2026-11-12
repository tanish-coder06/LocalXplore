const express = require("express");
const router = express.Router();

// Import profile controller functions
const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/profileController");

// Import authentication middleware
const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Only authenticated tourists and guides can access profiles
router.use(verifyToken, authorizeRoles("tourist", "guide"));

// Get logged-in user's profile
router.get("/me", getMyProfile);

// Update logged-in user's profile
router.put("/me", updateMyProfile);

module.exports = router;