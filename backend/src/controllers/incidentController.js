
const EmergencyIncident = require("../models/EmergencyIncident");

// Create a new SOS incident
const createIncident = async (req, res) => {
  try {
    const {
      incidentType,
      latitude,
      longitude,
      address,
      description
    } = req.body;

    if (latitude !== undefined &&
        (typeof latitude !== "number" || latitude < -90 || latitude > 90)) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude."
      });
    }

    if (longitude !== undefined &&
        (typeof longitude !== "number" || longitude < -180 || longitude > 180)) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude."
      });
    }

    const allowedTypes = ["SOS", "Medical", "Harassment", "Other"];

    if (incidentType && !allowedTypes.includes(incidentType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident type."
      });
    }

    const incident = await EmergencyIncident.create({
      user: req.user._id,
      incidentType: incidentType || "SOS",
      location: {
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(address && { address })
      },
      description: description || ""
    });

    return res.status(201).json({
      success: true,
      message: "Demo incident recorded successfully. No real emergency alert was sent.",
      incident
    });

  } catch (error) {
    console.error("Create incident error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to record incident."
    });
  }
};

// Get logged-in user's incident history
const getIncidents = async (req, res) => {
  try {
    const incidents = await EmergencyIncident.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: incidents.length,
      incidents
    });

  } catch (error) {
    console.error("Get incidents error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch incident history."
    });
  }
};

// Get one incident belonging to the logged-in user
const getIncidentById = async (req, res) => {
  try {
    const incident = await EmergencyIncident.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found."
      });
    }

    return res.status(200).json({
      success: true,
      incident
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid incident ID."
    });
  }
};

// Resolve an active incident
const resolveIncident = async (req, res) => {
  try {
    const incident = await EmergencyIncident.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found."
      });
    }

    if (incident.status === "Resolved") {
      return res.status(400).json({
        success: false,
        message: "Incident is already resolved."
      });
    }

    incident.status = "Resolved";
    incident.resolvedAt = new Date();

    await incident.save();

    return res.status(200).json({
      success: true,
      message: "Incident resolved successfully.",
      incident
    });

  } catch (error) {
    console.error("Resolve incident error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to resolve incident."
    });
  }
};

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  resolveIncident
};
