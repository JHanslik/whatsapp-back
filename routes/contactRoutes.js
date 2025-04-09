const express = require("express");
const router = express.Router();
const ContactController = require("../controllers/contactController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes protégées par authentification
router.post("/add", authMiddleware, ContactController.addContact);
router.get("/user/:userId", authMiddleware, ContactController.getUserContacts);
router.delete("/:contactId", authMiddleware, ContactController.deleteContact);

module.exports = router;
