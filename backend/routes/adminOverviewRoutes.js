const express = require("express");
const router = express.Router();

const {
    getPlatformOverview
} = require("../controllers/adminOverviewController");

const {
    verifyToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

// Admin-only platform statistics
router.get(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    getPlatformOverview
);

module.exports = router;