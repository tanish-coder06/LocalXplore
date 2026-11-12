const express = require("express");
const router = express.Router();

const {
  createReview,
  getExperienceReviews,
  getMyReviews,
} = require("../controllers/reviewController");

const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Public: View reviews for an experience
router.get("/experience/:experienceId", getExperienceReviews);

// Tourist: View their own reviews
router.get(
  "/my",
  verifyToken,
  authorizeRoles("tourist"),
  getMyReviews
);

// Tourist: Submit a review
router.post(
  "/",
  verifyToken,
  authorizeRoles("tourist"),
  createReview
);

module.exports = router;