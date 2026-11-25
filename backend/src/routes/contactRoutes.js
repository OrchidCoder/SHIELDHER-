
const express = require("express");
const router = express.Router();

const {
  addContact,
  getContacts,
  updateContact,
  deleteContact
} = require("../controllers/contactController");

const { protect } = require("../middleware/authMiddleware");

// All contact routes require authentication
router.use(protect);

// Add a contact
router.post("/", addContact);

// Get all contacts
router.get("/", getContacts);

// Update a contact
router.put("/:id", updateContact);

// Delete a contact
router.delete("/:id", deleteContact);

module.exports = router;
