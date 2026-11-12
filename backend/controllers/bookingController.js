const db = require("../config/db");

// Create a booking for an active experience
exports.createBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { experience_id, booking_date, participants } = req.body;

        const experienceId = Number(experience_id);
        const participantCount = Number(participants);

        // Validate experience ID
        if (!Number.isSafeInteger(experienceId) || experienceId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID."
            });
        }

        // Validate participants
        if (
            !Number.isSafeInteger(participantCount) ||
            participantCount < 1 ||
            participantCount > 10
        ) {
            return res.status(400).json({
                success: false,
                message: "Participants must be between 1 and 10."
            });
        }

        // Validate booking date
        if (
            typeof booking_date !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(booking_date)
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid booking date."
            });
        }

        // Reject invalid calendar dates and past dates
        const parsedDate = new Date(`${booking_date}T00:00:00Z`);

        if (
            Number.isNaN(parsedDate.getTime()) ||
            parsedDate.toISOString().slice(0, 10) !== booking_date
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid calendar date."
            });
        }

        const today = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata"
        });

        if (booking_date < today) {
            return res.status(400).json({
                success: false,
                message: "Booking date cannot be in the past."
            });
        }

        // Only active experiences from active guides can be booked
        const [experiences] = await db.query(
            `SELECT e.id, e.price
             FROM experiences e
             JOIN users u ON e.guide_id = u.id
             WHERE e.id = ?
               AND e.status = 'active'
               AND u.status = 'active'`,
            [experienceId]
        );

        if (experiences.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Experience is unavailable for booking."
            });
        }

        // Calculate price on the server
        const totalPrice = (
            Number(experiences[0].price) * participantCount
        ).toFixed(2);

        const [result] = await db.query(
            `INSERT INTO bookings
             (user_id, experience_id, booking_date, participants, total_price, status)
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [userId, experienceId, booking_date, participantCount, totalPrice]
        );

        return res.status(201).json({
            success: true,
            message: "Booking request submitted successfully!",
            booking: {
                id: result.insertId,
                experience_id: experienceId,
                booking_date,
                participants: participantCount,
                total_price: totalPrice,
                status: "pending"
            }
        });

    } catch (error) {
        console.error("Create Booking Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create booking."
        });
    }
};
// Get all bookings belonging to the logged-in tourist
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

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
        e.duration
      FROM bookings b
      JOIN experiences e ON b.experience_id = e.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC, b.id DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get My Bookings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings.",
    });
  }
};

// Cancel a pending booking belonging to the logged-in tourist
exports.cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = Number(req.params.id);

    if (!Number.isSafeInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const [result] = await db.query(
      `UPDATE bookings
       SET status = 'cancelled'
       WHERE id = ?
         AND user_id = ?
         AND status = 'pending'`,
      [bookingId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Pending booking not found or cannot be cancelled.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking.",
    });
  }
};
