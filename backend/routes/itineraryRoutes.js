// Import Express to create API routes
const express = require("express");

// Create an Express router
const router = express.Router();

// Import authentication and role authorization middleware
const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

// Import itinerary controller functions
const {
  createItinerary,
  getMyItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
  addItineraryItem,
  removeItineraryItem,
  updateItineraryItem
} = require("../controllers/itineraryController");

// ========================================
// PROTECT ALL ITINERARY ROUTES
// ========================================

// Only authenticated tourists can access these APIs
router.use(verifyToken, authorizeRoles("tourist"));

// ========================================
// ITINERARY ROUTES
// ========================================

// Create a new itinerary
router.post("/", createItinerary);

// Get all itineraries belonging to the logged-in tourist
router.get("/my", getMyItineraries);

// Get one itinerary and its planned experiences
router.get("/:id", getItineraryById);

// Update itinerary details
router.put("/:id", updateItinerary);

// Delete an itinerary
router.delete("/:id", deleteItinerary);

// ========================================
// ITINERARY EXPERIENCE ROUTES
// ========================================

// Add an experience to an itinerary
router.post("/:id/items", addItineraryItem);

// Remove an experience from an itinerary
router.delete("/:id/items/:itemId", removeItineraryItem);

// Update an experience's day number or notes
router.patch("/:id/items/:itemId", updateItineraryItem);

// Export the router
module.exports = router;