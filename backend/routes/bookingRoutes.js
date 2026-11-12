const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  cancelBooking,
} = require("../controllers/bookingController");

const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Create a booking
router.post(
  "/",
  verifyToken,
  authorizeRoles("tourist"),
  createBooking
);

// View logged-in tourist's bookings
router.get(
  "/my",
  verifyToken,
  authorizeRoles("tourist"),
  getMyBookings
);

// Cancel a pending booking
router.patch(
  "/:id/cancel",
  verifyToken,
  authorizeRoles("tourist"),
  cancelBooking
);

module.exports = router;