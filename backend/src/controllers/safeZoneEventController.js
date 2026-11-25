
const mongoose = require("mongoose");
const SafeZone = require("../models/SafeZone");
const SafeZoneEvent = require("../models/SafeZoneEvent");

// Save a Safe Zone entry or exit event
const createSafeZoneEvent = async (req, res) => {
  try {
    const {
      safeZoneId,
      eventType,
      latitude,
      longitude
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(safeZoneId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Safe Zone ID."
      });
    }

    if (!["entered", "exited"].includes(eventType)) {
      return res.status(400).json({
        success: false,
        message: "Event type must be entered or exited."
      });
    }

    if (
      typeof latitude !== "number" ||
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude."
      });
    }

    if (
      typeof longitude !== "number" ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude."
      });
    }

    const zone = await SafeZone.findOne({
      _id: safeZoneId,
      user: req.user._id
    });

    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Safe Zone not found."
      });
    }

    const event = await SafeZoneEvent.create({
      user: req.user._id,
      safeZone: zone._id,
      zoneName: zone.name,
      eventType,
      location: {
        latitude,
        longitude
      }
    });

    return res.status(201).json({
      success: true,
      message: "Safe Zone event saved successfully.",
      event
    });

  } catch (error) {
    console.error("Create Safe Zone event error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save Safe Zone event."
    });
  }
};

// Get logged-in user's Safe Zone event history
const getSafeZoneEvents = async (req, res) => {
  try {
    const events = await SafeZoneEvent.find({
      user: req.user._id
    }).sort({ eventAt: -1 }).limit(100);

    return res.status(200).json({
      success: true,
      count: events.length,
      events
    });

  } catch (error) {
    console.error("Get Safe Zone events error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch Safe Zone event history."
    });
  }
};

module.exports = {
  createSafeZoneEvent,
  getSafeZoneEvents
};
