const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const {
    verifyToken,
    authorizeRoles
} = require("./middleware/authMiddleware");
const adminExperienceRoutes = require("./routes/adminExperienceRoutes");
// Admin user management routes
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminOverviewRoutes = require("./routes/adminOverviewRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const guideBookingRoutes = require("./routes/guideBookingRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const profileRoutes = require("./routes/profileRoutes");
// Import itinerary routes
const itineraryRoutes = require("./routes/itineraryRoutes");
const app = express();

app.use(cors());

// Parse JSON before processing API requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/guide/bookings", guideBookingRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/profile", profileRoutes);
// Register itinerary APIs
app.use("/api/itineraries", itineraryRoutes);

// Register routes after middleware
app.use("/api/admin/overview", adminOverviewRoutes);
app.use("/api/bookings", bookingRoutes);


// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to LocalXplore API",
        status: "Server is running"
    });
});

// Database connection test
app.get("/api/health/db", async (req, res) => {
    try {
        const [result] = await db.query("SELECT 1 AS connected");

        res.status(200).json({
            success: true,
            message: "MySQL connected successfully!",
            database: "localxplore_db",
            status: result[0].connected
        });

    } catch (error) {
        console.error("Database Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// Authentication routes
app.use("/api/auth", authRoutes);
// Experience routes
app.use("/api/experiences", experienceRoutes);
// Admin Experience Management Routes
app.use("/api/admin/experiences", adminExperienceRoutes);
// Register admin user management API
app.use("/api/admin/users", adminUserRoutes);
// Start server
const PORT = process.env.PORT || 5000;
// Test route: Any authenticated user
app.get("/api/test/protected", verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: "You have accessed a protected route!",
        user: req.user
    });
});

// Test route: Only guides can access
app.get(
    "/api/test/guide",
    verifyToken,
    authorizeRoles("guide"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome Guide! You are authorized."
        });
    }
);

app.listen(PORT, () => {
    console.log(`LocalXplore server running on port ${PORT}`);
});