const db = require("../config/db");

// ========================================
// CREATE ITINERARY
// ========================================

const createItinerary = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            title,
            description,
            start_date,
            end_date
        } = req.body;

        // Validate itinerary title
        if (
            typeof title !== "string" ||
            title.trim().length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Itinerary title is required."
            });
        }

        if (title.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: "Title cannot exceed 150 characters."
            });
        }

        // Validate date order
        if (
            start_date &&
            end_date &&
            new Date(start_date) > new Date(end_date)
        ) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date."
            });
        }

        // Insert itinerary into MySQL
        const [result] = await db.query(
            `INSERT INTO itineraries
       (user_id, title, description, start_date, end_date)
       VALUES (?, ?, ?, ?, ?)`,
            [
                userId,
                title.trim(),
                description || null,
                start_date || null,
                end_date || null
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Itinerary created successfully.",
            itineraryId: result.insertId
        });

    } catch (error) {
        console.error("Create Itinerary Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create itinerary."
        });
    }
};

// ========================================
// GET MY ITINERARIES
// ========================================

const getMyItineraries = async (req, res) => {
    try {
        const userId = req.user.id;

        const [itineraries] = await db.query(
            `SELECT
         i.*,
         COUNT(ii.id) AS total_experiences
       FROM itineraries i
       LEFT JOIN itinerary_items ii
         ON i.id = ii.itinerary_id
       WHERE i.user_id = ?
       GROUP BY i.id
       ORDER BY i.created_at DESC, i.id DESC`,
            [userId]
        );

        return res.status(200).json({
            success: true,
            itineraries
        });

    } catch (error) {
        console.error("Get My Itineraries Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch itineraries."
        });
    }
};

// ========================================
// GET SINGLE ITINERARY
// ========================================

const getItineraryById = async (req, res) => {
    try {
        const userId = req.user.id;
        const itineraryId = req.params.id;

        // Check itinerary ownership
        const [itineraries] = await db.query(
            `SELECT *
       FROM itineraries
       WHERE id = ? AND user_id = ?`,
            [itineraryId, userId]
        );

        if (itineraries.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found."
            });
        }

        // Fetch itinerary experiences
        const [items] = await db.query(
            `SELECT
         ii.id,
         ii.itinerary_id,
         ii.experience_id,
         ii.day_number,
         ii.notes,
         ii.created_at,
         e.title,
         e.city,
         e.location,
         e.category,
         e.price,
         e.image,
         e.status
       FROM itinerary_items ii
       JOIN experiences e
         ON ii.experience_id = e.id
       WHERE ii.itinerary_id = ?
       ORDER BY ii.day_number ASC, ii.id ASC`,
            [itineraryId]
        );

        return res.status(200).json({
            success: true,
            itinerary: itineraries[0],
            items
        });

    } catch (error) {
        console.error("Get Itinerary Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch itinerary."
        });
    }
};

// ========================================
// UPDATE ITINERARY
// ========================================

const updateItinerary = async (req, res) => {
    try {
        const userId = req.user.id;
        const itineraryId = req.params.id;

        const {
            title,
            description,
            start_date,
            end_date
        } = req.body;

        // Check itinerary ownership
        const [existing] = await db.query(
            `SELECT *
       FROM itineraries
       WHERE id = ? AND user_id = ?`,
            [itineraryId, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found."
            });
        }

        const current = existing[0];

        const updatedTitle =
            title !== undefined ? title : current.title;

        const updatedDescription =
            description !== undefined
                ? description
                : current.description;

        const updatedStartDate =
            start_date !== undefined
                ? start_date
                : current.start_date;

        const updatedEndDate =
            end_date !== undefined
                ? end_date
                : current.end_date;

        if (
            typeof updatedTitle !== "string" ||
            !updatedTitle.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Itinerary title is required."
            });
        }

        if (updatedTitle.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: "Title cannot exceed 150 characters."
            });
        }

        if (
            updatedStartDate &&
            updatedEndDate &&
            new Date(updatedStartDate) >
            new Date(updatedEndDate)
        ) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date."
            });
        }

        await db.query(
            `UPDATE itineraries
       SET title = ?,
           description = ?,
           start_date = ?,
           end_date = ?
       WHERE id = ? AND user_id = ?`,
            [
                updatedTitle.trim(),
                updatedDescription,
                updatedStartDate,
                updatedEndDate,
                itineraryId,
                userId
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Itinerary updated successfully."
        });

    } catch (error) {
        console.error("Update Itinerary Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update itinerary."
        });
    }
};

// ========================================
// DELETE ITINERARY
// ========================================

const deleteItinerary = async (req, res) => {
    try {
        const userId = req.user.id;
        const itineraryId = req.params.id;

        const [result] = await db.query(
            `DELETE FROM itineraries
       WHERE id = ? AND user_id = ?`,
            [itineraryId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found."
            });
        }

        // Related itinerary_items are deleted by ON DELETE CASCADE
        return res.status(200).json({
            success: true,
            message: "Itinerary deleted successfully."
        });

    } catch (error) {
        console.error("Delete Itinerary Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete itinerary."
        });
    }
};

// ========================================
// ADD EXPERIENCE TO ITINERARY
// ========================================

const addItineraryItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const itineraryId = req.params.id;

        const {
            experience_id,
            day_number = 1,
            notes
        } = req.body;

        // Validate experience ID
        if (
            !Number.isSafeInteger(Number(experience_id)) ||
            Number(experience_id) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid experience ID is required."
            });
        }

        // Validate day number
        if (
            !Number.isSafeInteger(Number(day_number)) ||
            Number(day_number) < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Day number must be a positive integer."
            });
        }

        // Verify itinerary belongs to tourist
        const [itineraries] = await db.query(
            `SELECT id
       FROM itineraries
       WHERE id = ? AND user_id = ?`,
            [itineraryId, userId]
        );

        if (itineraries.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found."
            });
        }

        // Only allow approved experiences
        const [experiences] = await db.query(
            `SELECT id
       FROM experiences
       WHERE id = ? AND status = 'active'`,
            [experience_id]
        );

        if (experiences.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Active experience not found."
            });
        }

        // Prevent duplicate experiences in the same itinerary
        const [existingItems] = await db.query(
            `SELECT id
       FROM itinerary_items
       WHERE itinerary_id = ? AND experience_id = ?`,
            [itineraryId, experience_id]
        );

        if (existingItems.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Experience is already in this itinerary."
            });
        }

        // Add experience to itinerary
        const [result] = await db.query(
            `INSERT INTO itinerary_items
       (itinerary_id, experience_id, day_number, notes)
       VALUES (?, ?, ?, ?)`,
            [
                itineraryId,
                experience_id,
                Number(day_number),
                notes || null
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Experience added to itinerary.",
            itemId: result.insertId
        });

    } catch (error) {
        console.error("Add Itinerary Item Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to add experience."
        });
    }
};

// ========================================
// REMOVE EXPERIENCE FROM ITINERARY
// ========================================

const removeItineraryItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const itineraryId = req.params.id;
        const itemId = req.params.itemId;

        // Delete only if the itinerary belongs to the logged-in tourist
        const [result] = await db.query(
            `DELETE ii
       FROM itinerary_items ii
       JOIN itineraries i
         ON ii.itinerary_id = i.id
       WHERE ii.id = ?
         AND ii.itinerary_id = ?
         AND i.user_id = ?`,
            [itemId, itineraryId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Itinerary item not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Experience removed from itinerary."
        });

    } catch (error) {
        console.error("Remove Itinerary Item Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to remove experience."
        });
    }
};
// ========================================
// UPDATE ITINERARY ITEM
// ========================================

// Allows a tourist to change the day or notes
// of an experience already in their itinerary.

const updateItineraryItem = async (req, res) => {
    try {
        // Get the logged-in tourist's ID
        const userId = req.user.id;

        // Get itinerary ID and item ID from the URL
        const { id, itemId } = req.params;

        // Get updated day number and notes
        const { day_number, notes } = req.body;

        // Validate the day number
        if (
            !Number.isInteger(Number(day_number)) ||
            Number(day_number) < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid day number.",
            });
        }

        // Check that the itinerary item belongs to this tourist
        const [items] = await db.query(
            `
      SELECT ii.id
      FROM itinerary_items ii
      JOIN itineraries i
        ON ii.itinerary_id = i.id
      WHERE ii.id = ?
        AND ii.itinerary_id = ?
        AND i.user_id = ?
      `,
            [itemId, id, userId]
        );

        // Stop if the item doesn't belong to the tourist
        if (items.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Itinerary experience not found.",
            });
        }

        // Update the day and notes
        await db.query(
            `
      UPDATE itinerary_items
      SET day_number = ?,
          notes = COALESCE(?, notes)
      WHERE id = ?
        AND itinerary_id = ?
      `,
            [Number(day_number), notes ?? null, itemId, id]
        );

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Itinerary experience updated successfully.",
        });
    } catch (error) {
        console.error("Error updating itinerary item:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update itinerary experience.",
        });
    }
};


// ========================================
// EXPORT CONTROLLER FUNCTIONS
// ========================================

module.exports = {
    createItinerary,
    getMyItineraries,
    getItineraryById,
    updateItinerary,
    deleteItinerary,
    addItineraryItem,
    removeItineraryItem,
    updateItineraryItem,
};