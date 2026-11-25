
const express = require("express");
const router = express.Router();

const {
  createIncident,
  getIncidents,
  getIncidentById,
  resolveIncident
} = require("../controllers/incidentController");

const { protect } = require("../middleware/authMiddleware");

// All incident routes require authentication
router.use(protect);

// Create a new SOS incident
router.post("/", createIncident);

// Get user's incident history
router.get("/", getIncidents);

// Get a specific incident
router.get("/:id", getIncidentById);

// Resolve an incident
router.patch("/:id/resolve", resolveIncident);

module.exports = router;
