// Import MySQL database connection
const db = require("../config/db");

// Import bcrypt for password hashing and verification
const bcrypt = require("bcrypt");

// Import JWT for authentication tokens
const jwt = require("jsonwebtoken");


// ========================================
// REGISTER USER
// ========================================

exports.register = async (req, res) => {
    try {
        // Get user details from the request
        const { full_name, email, password, phone, role } = req.body;

        // Check required fields
        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        // Validate role
        const userRole = role || "tourist";

        // Only tourists and guides can register
        if (!["tourist", "guide"].includes(userRole)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user role"
            });
        }

        // Check whether the email is already registered
        const [existingUser] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        // The status column automatically defaults to 'active'
        const [result] = await db.query(
            `INSERT INTO users
            (full_name, email, password, phone, role)
            VALUES (?, ?, ?, ?, ?)`,
            [full_name, email, hashedPassword, phone || null, userRole]
        );

        // Return successful registration response
        return res.status(201).json({
            success: true,
            message: "Registration successful!",
            userId: result.insertId
        });

    } catch (error) {
        // Log registration errors
        console.error("Registration Error:", error);

        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};


// ========================================
// LOGIN USER
// ========================================

exports.login = async (req, res) => {
    try {
        // Get email and password from the request
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find the user by email
        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        // Check whether the user exists
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Get the user record
        const user = users[0];

        // Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        // Reject incorrect passwords
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // ========================================
        // NEW: CHECK USER ACCOUNT STATUS
        // ========================================

        // Prevent inactive users from logging in
        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Please contact support."
            });
        }

        // ========================================
        // GENERATE JWT TOKEN
        // ========================================

        // Create a JWT containing user ID and role
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Return successful login response
        return res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        // Log login errors
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};