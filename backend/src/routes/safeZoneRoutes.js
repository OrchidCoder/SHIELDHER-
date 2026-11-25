
const express = require("express");
const router = express.Router();

const {
  createSafeZone,
  getSafeZones,
  updateSafeZone,
  deleteSafeZone
} = require("../controllers/safeZoneController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createSafeZone);
router.get("/", getSafeZones);
router.patch("/:id", updateSafeZone);
router.delete("/:id", deleteSafeZone);

module.exports = router;
