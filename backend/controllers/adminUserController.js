// Import the existing MySQL database connection
const db = require("../config/db");

// Get all registered LocalXplore users
exports.getAllUsers = async (req, res) => {
    try {
        // Retrieve user information without exposing passwords
        const [users] = await db.query(
            `SELECT
                id,
                full_name,
                email,
                phone,
                role,
                status,
                profile_image,
                created_at
             FROM users
             ORDER BY created_at DESC, id DESC`
        );

        // Send the user list to the frontend
        return res.status(200).json({
            success: true,
            count: users.length,
            users: users
        });

    } catch (error) {
        // Log unexpected database errors
        console.error("Get All Users Error:", error);

        // Return a safe error message
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve users."
        });
    }
};
// ========================================
// DEACTIVATE USER ACCOUNT
// ========================================

exports.deactivateUser = async (req, res) => {
    try {
        // Get the user ID from the URL
        const userId = Number(req.params.id);

        // Validate the user ID
        if (!Number.isSafeInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID."
            });
        }

        // Prevent administrators from deactivating themselves
        if (userId === req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You cannot deactivate your own account."
            });
        }

        // Find the user in the database
        const [users] = await db.query(
            "SELECT id, role, status FROM users WHERE id = ?",
            [userId]
        );

        // Check whether the user exists
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const user = users[0];

        // Prevent deactivation of administrator accounts
        if (user.role === "admin") {
            return res.status(403).json({
                success: false,
                message: "Administrator accounts cannot be deactivated."
            });
        }

        // Check whether the account is already inactive
        if (user.status === "inactive") {
            return res.status(409).json({
                success: false,
                message: "This account is already inactive."
            });
        }

        // Deactivate the account
        const [result] = await db.query(
            `UPDATE users
             SET status = 'inactive'
             WHERE id = ?
             AND status = 'active'
             AND role IN ('tourist', 'guide')`,
            [userId]
        );

        // Handle a concurrent status or role change
        if (result.affectedRows === 0) {
            return res.status(409).json({
                success: false,
                message: "Account status changed. Please refresh and try again."
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "User account deactivated successfully."
        });

    } catch (error) {
        console.error("Deactivate User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to deactivate user account."
        });
    }
};

exports.reactivateUser = async (req, res) => {
    try {
        // Get the user ID from the URL
        const userId = Number(req.params.id);

        // Validate the user ID
        if (!Number.isSafeInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID."
            });
        }

        // Find the user in the database
        const [users] = await db.query(
            "SELECT id, role, status FROM users WHERE id = ?",
            [userId]
        );

        // Check whether the user exists
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const user = users[0];

        // Only tourist and guide accounts can be reactivated
        if (!["tourist", "guide"].includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: "Administrator accounts cannot be modified."
            });
        }

        // Check whether the account is already active
        if (user.status === "active") {
            return res.status(409).json({
                success: false,
                message: "This account is already active."
            });
        }

        // Reactivate the account
        const [result] = await db.query(
            `UPDATE users
             SET status = 'active'
             WHERE id = ?
             AND status = 'inactive'
             AND role IN ('tourist', 'guide')`,
            [userId]
        );

        // Handle a concurrent status or role change
        if (result.affectedRows === 0) {
            return res.status(409).json({
                success: false,
                message: "Account status changed. Please refresh and try again."
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "User account reactivated successfully."
        });

    } catch (error) {
        console.error("Reactivate User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to reactivate user account."
        });
    }
};