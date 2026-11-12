// Import the existing MySQL database connection
const db = require("../config/db");

// Controller for creating a new experience
exports.createExperience = async (req, res) => {
    try {
        // Get experience details from the request body
        const {
            title,
            category,
            location,
            city,
            duration,
            duration_hours,
            price,
            description,
            image
        } = req.body;

        // Get the authenticated guide's ID from the verified JWT
        const guide_id = req.user.id;

        // Validate required fields
        if (!title || !category || !location || !city ||
            price === undefined || price === null || price === "") {
            return res.status(400).json({
                success: false,
                message: "Please fill all required experience fields."
            });
        }

        // Validate price
        if (!Number.isFinite(Number(price)) || Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid price."
            });
        }

        // Insert the new experience into MySQL
        const [result] = await db.query(
            `INSERT INTO experiences
            (guide_id, title, category, location, city,
             duration, duration_hours, price, description, image, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                guide_id,
                title,
                category,
                location,
                city,
                duration || null,
                duration_hours || null,
                Number(price),
                description || null,
                image || null,
                "pending"
            ]
        );

        // Return success response
        return res.status(201).json({
            success: true,
            message: "Experience submitted for admin approval!",
            experienceId: result.insertId,
            status: "pending"
        });

    } catch (error) {
        // Log the error on the backend
        console.error("Create Experience Error:", error);

        // Return a safe error response
        return res.status(500).json({
            success: false,
            message: "Failed to create experience."
        });
    }
};
// Controller to retrieve experiences created by the logged-in guide
exports.getMyExperiences = async (req, res) => {
    try {
        // Get the guide ID from the verified JWT
        const guideId = req.user.id;

        // Retrieve only experiences belonging to this guide
        const [experiences] = await db.query(
            `SELECT
                id,
                title,
                category,
                location,
                city,
                duration,
                duration_hours,
                price,
                rating,
                description,
                image,
                status,
                created_at
             FROM experiences
             WHERE guide_id = ?
             ORDER BY created_at DESC, id DESC`,
            [guideId]
        );

        // Send the experiences to the frontend
        return res.status(200).json({
            success: true,
            count: experiences.length,
            experiences: experiences
        });

    } catch (error) {
        console.error("Get My Experiences Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve experiences."
        });
    }
};
// Update an experience belonging to the logged-in guide
exports.updateExperience = async (req, res) => {
    try {
        // Read experience ID from the URL
        const experienceId = Number(req.params.id);

        // Read guide ID from the verified JWT
        const guideId = req.user.id;

        // Validate experience ID
        if (!Number.isSafeInteger(experienceId) || experienceId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID."
            });
        }

        // Extract editable fields
        const {
            title,
            category,
            location,
            city,
            duration,
            duration_hours,
            price,
            description,
            image
        } = req.body;

        // Validate required fields
        if (
            typeof title !== "string" || !title.trim() ||
            typeof category !== "string" || !category.trim() ||
            typeof location !== "string" || !location.trim() ||
            typeof city !== "string" || !city.trim() ||
            price === undefined || price === null || price === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required experience fields."
            });
        }

        // Validate price
        if (!Number.isFinite(Number(price)) || Number(price) < 0 || Number(price) > 99999999.99) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid price."
            });
        }

        // Validate duration in hours
        const hours =
            duration_hours === "" ||
            duration_hours === null ||
            duration_hours === undefined
                ? null
                : Number(duration_hours);

        if (
            hours !== null &&
            (!Number.isFinite(hours) || hours < 0 || hours > 99.99)
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid duration."
            });
        }

        // Check field lengths against the database schema
        if (
            title.trim().length > 200 ||
            category.trim().length > 100 ||
            location.trim().length > 200 ||
            city.trim().length > 100 ||
            (duration != null && (typeof duration !== "string" || duration.length > 50)) ||
            (image != null && (typeof image !== "string" || image.length > 500)) ||
            (description != null && typeof description !== "string")
        ) {
            return res.status(400).json({
                success: false,
                message: "One or more fields contain invalid data."
            });
        }

        // Update only if this experience belongs to the logged-in guide
        const [result] = await db.query(
            `UPDATE experiences
             SET title = ?,
                 category = ?,
                 location = ?,
                 city = ?,
                 duration = ?,
                 duration_hours = ?,
                 price = ?,
                 description = ?,
                 image = ?,
                 status = 'pending'
             WHERE id = ? AND guide_id = ?`,
            [
                title.trim(),
                category.trim(),
                location.trim(),
                city.trim(),
                duration?.trim() || null,
                hours,
                Number(price),
                description?.trim() || null,
                image?.trim() || null,
                experienceId,
                guideId
            ]
        );

        // No matching experience owned by this guide
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Experience not found or access denied."
            });
        }

        // Return success
        return res.status(200).json({
            success: true,
            message: "Experience updated and submitted for admin approval!",
            status: "pending"
        });

    } catch (error) {
        console.error("Update Experience Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update experience."
        });
    }
};
// Deactivate an experience belonging to the logged-in guide
exports.deactivateExperience = async (req, res) => {
    try {
        // Get experience ID from the URL
        const experienceId = Number(req.params.id);

        // Get guide ID from the verified JWT
        const guideId = req.user.id;

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

        // Deactivate only an experience owned by this guide
        const [result] = await db.query(
            `UPDATE experiences
             SET status = 'inactive'
             WHERE id = ?
               AND guide_id = ?
               AND status IN ('pending', 'active')`,
            [experienceId, guideId]
        );

        // Check whether an experience was updated
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Experience not found, access denied, or cannot be deactivated from its current status."
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Experience deactivated successfully!",
            status: "inactive"
        });

    } catch (error) {
        console.error("Deactivate Experience Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to deactivate experience."
        });
    }
};
// Get all active experiences for tourists
exports.getActiveExperiences = async (req, res) => {
    try {
        const [experiences] = await db.query(
            `SELECT
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
                e.status,
                e.created_at,
                u.full_name AS guide_name
             FROM experiences e
             LEFT JOIN users u ON e.guide_id = u.id
             WHERE e.status = 'active'
             AND u.status = 'active'
             ORDER BY e.created_at DESC, e.id DESC`
        );

        return res.status(200).json({
            success: true,
            count: experiences.length,
            experiences
        });

    } catch (error) {
        console.error("Get Active Experiences Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve experiences."
        });
    }
};
// Get one active experience by ID
exports.getActiveExperienceById = async (req, res) => {
    try {
        const experienceId = Number(req.params.id);

        if (!Number.isSafeInteger(experienceId) || experienceId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID."
            });
        }

        const [experiences] = await db.query(
            `SELECT
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
                e.status,
                u.full_name AS guide_name
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
                message: "Experience not found or unavailable."
            });
        }

        return res.status(200).json({
            success: true,
            experience: experiences[0]
        });

    } catch (error) {
        console.error("Get Experience Details Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve experience details."
        });
    }
};