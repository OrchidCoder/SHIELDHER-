
const mongoose = require("mongoose");

const emergencyIncidentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    incidentType: {
      type: String,
      enum: ["SOS", "Medical", "Harassment", "Other"],
      default: "SOS"
    },

    status: {
      type: String,
      enum: ["Active", "Resolved"],
      default: "Active"
    },

    location: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      },
      address: {
        type: String,
        trim: true,
        maxlength: 300
      }
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ""
    },

    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

emergencyIncidentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model(
  "EmergencyIncident",
  emergencyIncidentSchema
);
