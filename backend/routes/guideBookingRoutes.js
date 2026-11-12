const express = require("express");
const router = express.Router();

const {
  getGuideBookings,
  confirmGuideBooking,
  rejectGuideBooking,
} = require("../controllers/guideBookingController");

const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Only guides can access these endpoints
router.use(verifyToken, authorizeRoles("guide"));

// View bookings for the logged-in guide's experiences
router.get("/", getGuideBookings);

// Confirm a pending booking
router.patch("/:id/confirm", confirmGuideBooking);

// Reject a pending booking
router.patch("/:id/reject", rejectGuideBooking);

module.exports = router;