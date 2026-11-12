// Import Express
const express = require("express");

// Create an Express router
const router = express.Router();

// Import the Create Experience controller
const {
    createExperience,
    getMyExperiences,
    updateExperience,
    deactivateExperience,
    getActiveExperiences,
    getActiveExperienceById
} = require("../controllers/experienceController");

// Import authentication and authorization middleware
const {
    verifyToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

// POST /api/experiences
// Only authenticated guides can create experiences
router.post(
    "/",
    verifyToken,
    authorizeRoles("guide"),
    createExperience
);
// GET /api/experiences/my
// Only authenticated guides can view their own experiences
router.get(
    "/my",
    verifyToken,
    authorizeRoles("guide"),
    getMyExperiences
);
// PUT /api/experiences/:id
// Only authenticated guides can update their own experiences
router.put(
    "/:id",
    verifyToken,
    authorizeRoles("guide"),
    updateExperience
);
// PATCH /api/experiences/:id/deactivate
// Only authenticated guides can deactivate their own experiences
router.patch(
    "/:id/deactivate",
    verifyToken,
    authorizeRoles("guide"),
    deactivateExperience
);
// Public route — display approved experiences
router.get("/active", getActiveExperiences);
// Public experience details
router.get("/active/:id", getActiveExperienceById);


// Export the router
module.exports = router;`   `