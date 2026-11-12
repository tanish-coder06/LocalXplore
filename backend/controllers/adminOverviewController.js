const db = require("../config/db");

// Get statistics for the Admin Platform Overview
exports.getPlatformOverview = async (req, res) => {
    try {
        // Count users by role
        const [userStats] = await db.query(`
            SELECT
                COUNT(*) AS totalUsers,
                SUM(CASE WHEN role = 'tourist' THEN 1 ELSE 0 END) AS tourists,
                SUM(CASE WHEN role = 'guide' THEN 1 ELSE 0 END) AS guides,
                SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admins,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS activeUsers,
                SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactiveUsers
            FROM users
        `);

        // Count experiences by status
        const [experienceStats] = await db.query(`
            SELECT
                COUNT(*) AS totalExperiences,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS activeExperiences,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingExperiences,
                SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactiveExperiences,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejectedExperiences
            FROM experiences
        `);

        // Count bookings and calculate confirmed booking revenue
        const [bookingStats] = await db.query(`
            SELECT
                COUNT(*) AS totalBookings,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingBookings,
                SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmedBookings,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelledBookings,
                COALESCE(
                    SUM(
                        CASE
                            WHEN status = 'confirmed' THEN total_price
                            ELSE 0
                        END
                    ),
                    0
                ) AS totalRevenue
            FROM bookings
        `);

        return res.status(200).json({
            success: true,
            users: userStats[0],
            experiences: experienceStats[0],
            bookings: bookingStats[0]
        });

    } catch (error) {
        console.error("Platform Overview Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve platform overview."
        });
    }
};