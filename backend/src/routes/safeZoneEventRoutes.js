
const express = require("express");
const router = express.Router();

const {
  createSafeZoneEvent,
  getSafeZoneEvents
} = require("../controllers/safeZoneEventController");

const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Save a Safe Zone entry or exit event
router.post("/", createSafeZoneEvent);

// Get the logged-in user's event history
router.get("/", getSafeZoneEvents);

module.exports = router;
