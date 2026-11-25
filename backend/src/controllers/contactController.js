
const TrustedContact = require("../models/TrustedContact");

// ADD CONTACT
exports.addContact = async (req, res, next) => {
  try {
    const { name, phone, relationship, priority } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Contact name and phone number are required."
      });
    }

    if (name.trim().length < 2 || phone.trim().length < 7) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid contact details."
      });
    }

    const contact = await TrustedContact.create({
      user: req.user._id,
      name: name.trim(),
      phone: phone.trim(),
      relationship: relationship || "Other",
      priority: priority || 1
    });

    return res.status(201).json({
      success: true,
      message: "Trusted contact added successfully.",
      contact
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already saved."
      });
    }

    next(error);
  }
};

// GET USER CONTACTS
exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await TrustedContact.find({
      user: req.user._id
    }).sort({ priority: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts
    });

  } catch (error) {
    next(error);
  }
};

// UPDATE CONTACT
exports.updateContact = async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "relationship",
      "priority"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update."
      });
    }

    if (
      updates.name !== undefined &&
      (typeof updates.name !== "string" || updates.name.trim().length < 2)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid contact name."
      });
    }

    if (
      updates.phone !== undefined &&
      (typeof updates.phone !== "string" || updates.phone.trim().length < 7)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number."
      });
    }

    if (updates.relationship !== undefined) {
      if (typeof updates.relationship !== "string" || updates.relationship.trim().length > 40) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid relationship."
        });
      }
      updates.relationship = updates.relationship.trim() || "Other";
    }

    if (updates.priority !== undefined) {
      const priority = Number(updates.priority);

      if (!Number.isInteger(priority) || priority < 1 || priority > 10) {
        return res.status(400).json({
          success: false,
          message: "Priority must be an integer between 1 and 10."
        });
      }

      updates.priority = priority;
    }

    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
    }

    if (updates.phone !== undefined) {
      updates.phone = updates.phone.trim();
    }

    const contact = await TrustedContact.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Trusted contact not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trusted contact updated successfully.",
      contact
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already saved."
      });
    }

    next(error);
  }
};

// DELETE CONTACT
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await TrustedContact.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Trusted contact not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trusted contact deleted successfully."
    });

  } catch (error) {
    next(error);
  }
};
