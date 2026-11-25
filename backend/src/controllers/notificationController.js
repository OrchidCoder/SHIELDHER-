
const EmergencyNotification = require("../models/EmergencyNotification");
const EmergencyIncident = require("../models/EmergencyIncident");
const TrustedContact = require("../models/TrustedContact");
const mongoose = require("mongoose");

// Create demo notifications for all trusted contacts
exports.createNotifications = async (req, res, next) => {
  try {
    const { incidentId } = req.body;

    if (!incidentId || !mongoose.Types.ObjectId.isValid(incidentId)) {
      return res.status(400).json({
        success: false,
        message: "A valid incident ID is required."
      });
    }

    // Verify that the incident belongs to the logged-in user
    const incident = await EmergencyIncident.findOne({
      _id: incidentId,
      user: req.user._id
    });

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found."
      });
    }

    // Get only this user's trusted contacts
    const contacts = await TrustedContact.find({
      user: req.user._id
    }).sort({ priority: 1, createdAt: 1 });

    if (contacts.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        notifications: [],
        message: "No trusted contacts are available."
      });
    }

    const { latitude, longitude } = incident.location || {};

    const mapsLink =
      Number.isFinite(latitude) && Number.isFinite(longitude)
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : null;

    const message = [
      "SHIELDHER DEMO EMERGENCY ALERT",
      `Incident type: ${incident.incidentType}`,
      "An SOS incident has been recorded.",
      mapsLink ? `Location: ${mapsLink}` : "GPS location is unavailable.",
      "This is a simulated notification. No real message was sent."
    ].join("\n");

    const notificationData = contacts.map((contact) => ({
      user: req.user._id,
      incident: incident._id,
      contact: contact._id,
      contactName: contact.name,
      phone: contact.phone,
      channel: "SMS",
      status: "Simulated",
      message
    }));

    const notifications = await EmergencyNotification.insertMany(
      notificationData
    );

    return res.status(201).json({
      success: true,
      count: notifications.length,
      notifications,
      message: `Created ${notifications.length} simulated notification record(s). No SMS or WhatsApp message was sent.`
    });
  } catch (error) {
    next(error);
  }
};

// Get notification history for the logged-in user
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await EmergencyNotification.find({
      user: req.user._id
    })
      .populate("incident", "incidentType status createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    next(error);
  }
};
