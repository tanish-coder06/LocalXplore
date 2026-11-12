// Import JWT to verify authentication tokens
const jwt = require("jsonwebtoken");

// Import the existing MySQL database connection
const db = require("../config/db");


// ========================================
// VERIFY AUTHENTICATION TOKEN
// ========================================

// Middleware to verify JWT and check current user status
const verifyToken = async (req, res, next) => {

    try {

        // Read the Authorization header
        const authHeader = req.headers.authorization;

        // Check whether a Bearer token was provided
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Extract the JWT token
        const token = authHeader.split(" ")[1];

        // Verify the token using the secret key
        let decoded;

        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token."
            });
        }

        // ========================================
        // CHECK USER IN DATABASE
        // ========================================

        // Find the user using the ID stored in the token
        const [users] = await db.query(
            "SELECT id, role, status FROM users WHERE id = ?",
            [decoded.id]
        );

        // Reject tokens belonging to deleted users
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "User account no longer exists."
            });
        }

        // Get the current user record
        const user = users[0];

        // ========================================
        // CHECK ACCOUNT STATUS
        // ========================================

        // Prevent inactive accounts from accessing protected APIs
        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Please contact support."
            });
        }

        // ========================================
        // ATTACH CURRENT USER INFORMATION
        // ========================================

        // Use the latest role from MySQL rather than
        // relying on the role stored in an older JWT
        req.user = {
            id: user.id,
            role: user.role
        };

        // Continue to the next middleware or route
        next();

    } catch (error) {

        // Log unexpected errors, including database failures
        console.error("Authentication Middleware Error:", error);

        return res.status(500).json({
            success: false,
            message: "Authentication verification failed."
        });
    }
};


// ========================================
// AUTHORIZE USER ROLES
// ========================================

// Middleware to restrict routes to specific user roles
const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {

        // Ensure authentication middleware ran first
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        // Check whether the user has the required role
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource."
            });
        }

        // User has permission to access this route
        next();
    };
};


// ========================================
// EXPORT MIDDLEWARE
// ========================================

module.exports = {
    verifyToken,
    authorizeRoles
};