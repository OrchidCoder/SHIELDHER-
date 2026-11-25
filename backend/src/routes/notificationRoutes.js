
const express = require("express");
const router = express.Router();

const {
  createNotifications,
  getNotifications
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// All notification routes require authentication
router.use(protect);

// Create simulated notifications for trusted contacts
router.post("/", createNotifications);

// Get notification history
router.get("/", getNotifications);

module.exports = router;
