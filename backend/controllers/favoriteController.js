const db = require("../config/db");

// Add an experience to favorites
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const experienceId = Number(req.params.experienceId);

    if (!Number.isSafeInteger(experienceId) || experienceId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience ID.",
      });
    }

    // Check whether the experience is available
    const [experiences] = await db.query(
      `SELECT e.id
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
        message: "Experience not found or unavailable.",
      });
    }

    // Prevent duplicate favorites
    const [result] = await db.query(
      `INSERT IGNORE INTO favorites (user_id, experience_id)
       VALUES (?, ?)`,
      [userId, experienceId]
    );

    return res.status(result.affectedRows === 1 ? 201 : 200).json({
      success: true,
      message:
        result.affectedRows === 1
          ? "Experience added to favorites."
          : "Experience is already in your favorites.",
    });
  } catch (error) {
    console.error("Add Favorite Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add favorite.",
    });
  }
};

// Get favorites belonging to the logged-in tourist
exports.getMyFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const [favorites] = await db.query(
      `SELECT
         f.id AS favorite_id,
         e.id,
         e.title,
         e.category,
         e.location,
         e.city,
         e.duration,
         e.duration_hours AS durationHours,
         e.price,
         e.rating,
         e.description,
         e.image,
         u.full_name AS guide_name,
         f.created_at AS saved_at
       FROM favorites f
       JOIN experiences e ON f.experience_id = e.id
       JOIN users u ON e.guide_id = u.id
       WHERE f.user_id = ?
         AND e.status = 'active'
         AND u.status = 'active'
       ORDER BY f.created_at DESC, f.id DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      count: favorites.length,
      favorites,
    });
  } catch (error) {
    console.error("Get My Favorites Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve favorites.",
    });
  }
};

// Remove an experience from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const experienceId = Number(req.params.experienceId);

    if (!Number.isSafeInteger(experienceId) || experienceId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience ID.",
      });
    }

    const [result] = await db.query(
      `DELETE FROM favorites
       WHERE user_id = ? AND experience_id = ?`,
      [userId, experienceId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Experience is not in your favorites.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Experience removed from favorites.",
    });
  } catch (error) {
    console.error("Remove Favorite Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove favorite.",
    });
  }
};