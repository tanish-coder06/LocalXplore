// Import MySQL database connection
const db = require("../config/db");

// Get all experiences waiting for admin approval
exports.getPendingExperiences = async (req, res) => {
    try {
        // Fetch pending experiences along with guide details
        const [experiences] = await db.query(
            `SELECT
                e.id,
                e.title,
                e.category,
                e.location,
                e.city,
                e.duration,
                e.duration_hours,
                e.price,
                e.description,
                e.image,
                e.status,
                e.created_at,
                u.full_name AS guide_name,
                u.email AS guide_email
             FROM experiences e
             JOIN users u ON e.guide_id = u.id
             WHERE e.status = 'pending'
             ORDER BY e.created_at ASC, e.id ASC`
        );

        // Return pending experiences
        return res.status(200).json({
            success: true,
            count: experiences.length,
            experiences: experiences
        });

    } catch (error) {
        console.error("Get Pending Experiences Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve pending experiences."
        });
    }
};
// Approve an experience submitted by a guide
exports.approveExperience = async (req, res) => {
    try {
        // Get the experience ID from the URL
        const experienceId = Number(req.params.id);

        // Validate the experience ID
        if (
            !Number.isSafeInteger(experienceId) ||
            experienceId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID."
            });
        }

        // Approve only experiences that are currently pending
        const [result] = await db.query(
            `UPDATE experiences
             SET status = 'active'
             WHERE id = ?
             AND status = 'pending'`,
            [experienceId]
        );

        // Check whether an experience was updated
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Experience not found or is not pending approval."
            });
        }

        // Return a success response
        return res.status(200).json({
            success: true,
            message: "Experience approved successfully!",
            experienceId: experienceId,
            status: "active"
        });

    } catch (error) {
        // Log errors in the backend terminal
        console.error("Approve Experience Error:", error);

        // Return an error response
        return res.status(500).json({
            success: false,
            message: "Failed to approve experience."
        });
    }
};
// Reject an experience submitted by a guide
exports.rejectExperience = async (req, res) => {
    try {
        // Get experience ID from the URL
        const experienceId = Number(req.params.id);

        // Validate experience ID
        if (
            !Number.isSafeInteger(experienceId) ||
            experienceId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID."
            });
        }

        // Reject only experiences that are currently pending
        const [result] = await db.query(
            `UPDATE experiences
             SET status = 'rejected'
             WHERE id = ?
             AND status = 'pending'`,
            [experienceId]
        );

        // Check whether the experience was updated
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Experience not found or is not pending approval."
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Experience rejected successfully!",
            experienceId: experienceId,
            status: "rejected"
        });

    } catch (error) {
        // Display error in backend terminal
        console.error("Reject Experience Error:", error);

        // Return server error response
        return res.status(500).json({
            success: false,
            message: "Failed to reject experience."
        });
    }
};
// Get all experiences for the Admin Manage Experiences page
exports.getAllExperiences = async (req, res) => {
    try {
        const [experiences] = await db.query(
            `SELECT
                e.id,
                e.guide_id,
                e.title,
                e.category,
                e.location,
                e.city,
                e.duration,
                e.duration_hours,
                e.price,
                e.description,
                e.image,
                e.status,
                e.created_at,
                u.full_name AS guide_name,
                u.email AS guide_email
             FROM experiences e
             LEFT JOIN users u ON e.guide_id = u.id
             ORDER BY e.created_at DESC, e.id DESC`
        );

        return res.status(200).json({
            success: true,
            count: experiences.length,
            experiences
        });

    } catch (error) {
        console.error("Get All Experiences Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve experiences."
        });
    }
};

// Allow administrators to deactivate active experiences
exports.adminDeactivateExperience = async (req, res) => {
    try {
        const experienceId = Number(req.params.id);

        if (!Number.isSafeInteger(experienceId) || experienceId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID."
            });
        }

        const [result] = await db.query(
            `UPDATE experiences
             SET status = 'inactive'
             WHERE id = ?
             AND status = 'active'`,
            [experienceId]
        );

        if (result.affectedRows === 0) {
            return res.status(409).json({
                success: false,
                message: "Experience not found or is not active."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Experience deactivated successfully!",
            experienceId,
            status: "inactive"
        });

    } catch (error) {
        console.error("Admin Deactivate Experience Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to deactivate experience."
        });
    }
};
// ========================================
// ADMIN: REACTIVATE INACTIVE EXPERIENCE
// ========================================

// Allow administrators to reactivate inactive experiences
exports.adminActivateExperience = async (req, res) => {
    try {
        // Get experience ID from URL
        const experienceId = Number(req.params.id);

        // Validate experience ID
        if (
            !Number.isSafeInteger(experienceId) ||
            experienceId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID."
            });
        }

        // Activate only experiences that are currently inactive
        const [result] = await db.query(
            `UPDATE experiences
             SET status = 'active'
             WHERE id = ?
             AND status = 'inactive'`,
            [experienceId]
        );

        // Check whether the experience was updated
        if (result.affectedRows === 0) {
            return res.status(409).json({
                success: false,
                message: "Experience not found or is not inactive."
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Experience activated successfully!",
            experienceId: experienceId,
            status: "active"
        });

    } catch (error) {
        // Log error in backend terminal
        console.error("Admin Activate Experience Error:", error);

        // Return server error
        return res.status(500).json({
            success: false,
            message: "Failed to activate experience."
        });
    }
};