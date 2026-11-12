const express = require("express");
const router = express.Router();

const {
  addFavorite,
  getMyFavorites,
  removeFavorite,
} = require("../controllers/favoriteController");

const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// All favorite routes require tourist authentication
router.use(verifyToken, authorizeRoles("tourist"));

// Get saved experiences
router.get("/my", getMyFavorites);

// Add an experience
router.post("/:experienceId", addFavorite);

// Remove an experience
router.delete("/:experienceId", removeFavorite);

module.exports = router;