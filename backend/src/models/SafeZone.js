
const mongoose = require("mongoose");

const safeZoneSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    address: {
      type: String,
      trim: true,
      maxlength: 300,
      default: ""
    },

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
    },

    radius: {
      type: Number,
      required: true,
      min: 50,
      max: 10000,
      default: 200
    }
  },
  {
    timestamps: true
  }
);

safeZoneSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("SafeZone", safeZoneSchema);
