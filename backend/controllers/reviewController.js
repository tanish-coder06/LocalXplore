const db = require("../config/db");

// 1. Submit a review
exports.createReview = async (req, res) => {
  const userId = req.user.id;
  const experienceId = Number(req.body.experience_id);
  const rating = Number(req.body.rating);
  const comment = req.body.comment;

  if (!Number.isSafeInteger(experienceId) || experienceId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid experience ID.",
    });
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5.",
    });
  }

  if (
    typeof comment !== "string" ||
    comment.trim().length < 5 ||
    comment.trim().length > 1000
  ) {
    return res.status(400).json({
      success: false,
      message: "Review must contain between 5 and 1000 characters.",
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Check that the tourist has a confirmed booking
    // whose booking date is today or earlier.
    const [bookings] = await connection.query(
      `SELECT id
       FROM bookings
       WHERE user_id = ?
         AND experience_id = ?
         AND status = 'confirmed'
         AND booking_date <= CURDATE()
       LIMIT 1`,
      [userId, experienceId]
    );

    if (bookings.length === 0) {
      await connection.rollback();

      return res.status(403).json({
        success: false,
        message:
          "You can review this experience only after its confirmed booking date.",
      });
    }

    // Save the review
    await connection.query(
      `INSERT INTO reviews
         (user_id, experience_id, rating, comment)
       VALUES (?, ?, ?, ?)`,
      [userId, experienceId, rating, comment.trim()]
    );

    // Recalculate the average rating
    await connection.query(
      `UPDATE experiences
       SET rating = (
         SELECT COALESCE(ROUND(AVG(r.rating), 1), 0)
         FROM reviews r
         WHERE r.experience_id = ?
       )
       WHERE id = ?`,
      [experienceId, experienceId]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
    });
  } catch (error) {
    if (connection) await connection.rollback();

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this experience.",
      });
    }

    console.error("Create Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit review.",
    });
  } finally {
    if (connection) connection.release();
  }
};

// 2. Get reviews for a particular experience
exports.getExperienceReviews = async (req, res) => {
  try {
    const experienceId = Number(req.params.experienceId);

    if (!Number.isSafeInteger(experienceId) || experienceId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience ID.",
      });
    }

    const [reviews] = await db.query(
      `SELECT
         r.id,
         r.rating,
         r.comment,
         r.created_at,
         u.full_name AS tourist_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.experience_id = ?
       ORDER BY r.created_at DESC, r.id DESC`,
      [experienceId]
    );

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get Experience Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve reviews.",
    });
  }
};

// 3. Get reviews submitted by the logged-in tourist
exports.getMyReviews = async (req, res) => {
  try {
    const [reviews] = await db.query(
      `SELECT
         r.id,
         r.experience_id,
         r.rating,
         r.comment,
         r.created_at,
         e.title AS experience_title,
         e.city,
         e.image
       FROM reviews r
       JOIN experiences e ON r.experience_id = e.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC, r.id DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get My Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve your reviews.",
    });
  }
};