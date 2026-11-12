const db = require("../config/db");

// ========================================
// GET LOGGED-IN USER PROFILE
// ========================================
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await db.query(
      `SELECT
        id,
        full_name,
        email,
        phone,
        role,
        profile_image,
        created_at
       FROM users
       WHERE id = ? AND status = 'active'`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve profile.",
    });
  }
};

// ========================================
// UPDATE LOGGED-IN USER PROFILE
// ========================================
exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, phone } = req.body;

    // Validate full name
    if (
      typeof full_name !== "string" ||
      full_name.trim().length < 2 ||
      full_name.trim().length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Full name must contain between 2 and 100 characters.",
      });
    }

    // Validate optional phone number
    if (
      phone !== null &&
      phone !== undefined &&
      (typeof phone !== "string" ||
        !/^[0-9+\-\s()]{7,20}$/.test(phone.trim()))
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    const [result] = await db.query(
      `UPDATE users
       SET full_name = ?, phone = ?
       WHERE id = ? AND status = 'active'`,
      [full_name.trim(), phone?.trim() || null, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    const [users] = await db.query(
      `SELECT
        id,
        full_name,
        email,
        phone,
        role,
        profile_image,
        created_at
       FROM users
       WHERE id = ?`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: users[0],
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};
