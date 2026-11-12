// Import Express
const express = require("express");

// Create an Express router
const router = express.Router();

// Import the controller for retrieving users
const {
    getAllUsers,
    deactivateUser,
    reactivateUser
} = require("../controllers/adminUserController");

// Import existing authentication and authorization middleware
const {
    verifyToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

// GET /api/admin/users
// Only administrators can retrieve registered users
router.get(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    getAllUsers
);
// Allow administrators to deactivate tourist and guide accounts
router.patch(
    "/:id/deactivate",
    verifyToken,
    authorizeRoles("admin"),
    deactivateUser
);
// Allow administrators to reactivate tourist and guide accounts
router.patch(
    "/:id/reactivate",
    verifyToken,
    authorizeRoles("admin"),
    reactivateUser
);
// Export the router
module.exports = router;