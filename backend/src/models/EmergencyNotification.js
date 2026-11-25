
const mongoose = require("mongoose");

const emergencyNotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmergencyIncident",
      required: true,
      index: true
    },

    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrustedContact",
      default: null
    },

    contactName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },

    channel: {
      type: String,
      enum: ["SMS", "WhatsApp"],
      default: "SMS"
    },

    status: {
      type: String,
      enum: ["Simulated", "Pending", "Sent", "Failed"],
      default: "Simulated"
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true
    },

    message: {
      type: String,
      required: true,
      maxlength: 1000
    },

    providerMessageId: {
      type: String,
      default: null
    },

    errorMessage: {
      type: String,
      default: ""
    },

    sentAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

emergencyNotificationSchema.index({
  user: 1,
  createdAt: -1
});

module.exports = mongoose.model(
  "EmergencyNotification",
  emergencyNotificationSchema
);
