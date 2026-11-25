
const mongoose = require("mongoose");

const safeZoneEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    safeZone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SafeZone",
      required: true
    },

    zoneName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    eventType: {
      type: String,
      enum: ["entered", "exited"],
      required: true
    },

    location: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
      },

      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      }
    },

    eventAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

safeZoneEventSchema.index({ user: 1, eventAt: -1 });

module.exports = mongoose.model("SafeZoneEvent", safeZoneEventSchema);

