
const mongoose = require("mongoose");

const trustedContactSchema = new mongoose.Schema(
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
      minlength: 2,
      maxlength: 60
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },

    relationship: {
      type: String,
      trim: true,
      maxlength: 40,
      default: "Other"
    },

    priority: {
      type: Number,
      min: 1,
      max: 10,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

trustedContactSchema.index({ user: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model(
  "TrustedContact",
  trustedContactSchema
);
