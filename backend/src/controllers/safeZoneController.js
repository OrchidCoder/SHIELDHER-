
const SafeZone = require("../models/SafeZone");

const validateCoordinates = (latitude, longitude) => {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

// Create Safe Zone
const createSafeZone = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude, radius } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Safe Zone name is required."
      });
    }

    if (!validateCoordinates(latitude, longitude)) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required."
      });
    }

    const zone = await SafeZone.create({
      user: req.user._id,
      name,
      address,
      latitude,
      longitude,
      radius: radius ?? 200
    });

    res.status(201).json({
      success: true,
      message: "Safe Zone created successfully.",
      zone
    });
  } catch (error) {
    next(error);
  }
};

// Get user's Safe Zones
const getSafeZones = async (req, res, next) => {
  try {
    const zones = await SafeZone.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: zones.length,
      zones
    });
  } catch (error) {
    next(error);
  }
};

// Update Safe Zone
const updateSafeZone = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude, radius } = req.body;

    const zone = await SafeZone.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Safe Zone not found."
      });
    }

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Safe Zone name cannot be empty."
        });
      }
      zone.name = name.trim();
    }

    if (address !== undefined) zone.address = address;

    if (latitude !== undefined || longitude !== undefined) {
      const nextLatitude = latitude ?? zone.latitude;
      const nextLongitude = longitude ?? zone.longitude;

      if (!validateCoordinates(nextLatitude, nextLongitude)) {
        return res.status(400).json({
          success: false,
          message: "Valid latitude and longitude are required."
        });
      }

      zone.latitude = nextLatitude;
      zone.longitude = nextLongitude;
    }

    if (radius !== undefined) {
      if (
        !Number.isFinite(radius) ||
        radius < 50 ||
        radius > 10000
      ) {
        return res.status(400).json({
          success: false,
          message: "Radius must be between 50 and 10000 metres."
        });
      }

      zone.radius = radius;
    }

    await zone.save();

    res.status(200).json({
      success: true,
      message: "Safe Zone updated successfully.",
      zone
    });
  } catch (error) {
    next(error);
  }
};

// Delete Safe Zone
const deleteSafeZone = async (req, res, next) => {
  try {
    const zone = await SafeZone.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Safe Zone not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Safe Zone deleted successfully."
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSafeZone,
  getSafeZones,
  updateSafeZone,
  deleteSafeZone
};
