// Import Express
const express = require("express");

// Create an Express router
const router = express.Router();

// Import admin experience controller
const {
    getPendingExperiences,
    approveExperience,
    rejectExperience,
    getAllExperiences,
    adminDeactivateExperience,
    adminActivateExperience // NEW: Reactivate inactive experiences
} = require("../controllers/adminExperienceController");

// Import authentication and authorization middleware
const {
    verifyToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

// ========================================
// GET PENDING EXPERIENCES
// ========================================

// GET /api/admin/experiences/pending
// Only administrators can view pending experiences
router.get(
    "/pending",
    verifyToken,
    authorizeRoles("admin"),
    getPendingExperiences
);

// ========================================
// APPROVE EXPERIENCE
// ========================================

// PATCH /api/admin/experiences/:id/approve
// Only administrators can approve pending experiences
router.patch(
    "/:id/approve",
    verifyToken,
    authorizeRoles("admin"),
    approveExperience
);

// ========================================
// REJECT EXPERIENCE
// ========================================

// PATCH /api/admin/experiences/:id/reject
// Only administrators can reject pending experiences
router.patch(
    "/:id/reject",
    verifyToken,
    authorizeRoles("admin"),
    rejectExperience
);

// ========================================
// GET ALL EXPERIENCES
// ========================================

// GET /api/admin/experiences
// Admin can view all experiences
router.get(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    getAllExperiences
);

// ========================================
// DEACTIVATE EXPERIENCE
// ========================================

// PATCH /api/admin/experiences/:id/deactivate
// Admin can deactivate active experiences
router.patch(
    "/:id/deactivate",
    verifyToken,
    authorizeRoles("admin"),
    adminDeactivateExperience
);

// ========================================
// ACTIVATE EXPERIENCE (NEW)
// ========================================

// PATCH /api/admin/experiences/:id/activate
// Admin can reactivate inactive experiences
router.patch(
    "/:id/activate",
    verifyToken,
    authorizeRoles("admin"),
    adminActivateExperience
);

// Export router
module.exports = router;