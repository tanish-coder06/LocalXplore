const db = require("../config/db");

// Get bookings for experiences owned by the logged-in guide
exports.getGuideBookings = async (req, res) => {
  try {
    const guideId = req.user.id;

    const [bookings] = await db.query(
      `SELECT
        b.id,
        b.experience_id,
        b.booking_date,
        b.participants,
        b.total_price,
        b.status,
        b.created_at,
        e.title AS experience_title,
        e.location,
        e.city,
        e.image,
        u.full_name AS tourist_name,
        u.email AS tourist_email
      FROM bookings b
      JOIN experiences e ON b.experience_id = e.id
      JOIN users u ON b.user_id = u.id
      WHERE e.guide_id = ?
      ORDER BY b.created_at DESC, b.id DESC`,
      [guideId]
    );

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get Guide Bookings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve guide bookings.",
    });
  }
};

// Confirm a pending booking
exports.confirmGuideBooking = async (req, res) => {
  try {
    const guideId = req.user.id;
    const bookingId = Number(req.params.id);

    if (!Number.isSafeInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const [result] = await db.query(
      `UPDATE bookings b
       JOIN experiences e ON b.experience_id = e.id
       SET b.status = 'confirmed'
       WHERE b.id = ?
         AND e.guide_id = ?
         AND e.status = 'active'
         AND b.status = 'pending'`,
      [bookingId, guideId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Pending booking not found or cannot be confirmed.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking confirmed successfully.",
    });
  } catch (error) {
    console.error("Confirm Guide Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to confirm booking.",
    });
  }
};

// Reject a pending booking
exports.rejectGuideBooking = async (req, res) => {
  try {
    const guideId = req.user.id;
    const bookingId = Number(req.params.id);

    if (!Number.isSafeInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const [result] = await db.query(
      `UPDATE bookings b
       JOIN experiences e ON b.experience_id = e.id
       SET b.status = 'cancelled'
       WHERE b.id = ?
         AND e.guide_id = ?
         AND b.status = 'pending'`,
      [bookingId, guideId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Pending booking not found or cannot be rejected.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking request rejected.",
    });
  } catch (error) {
    console.error("Reject Guide Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject booking.",
    });
  }
};