const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes protégées par authentification
router.post("/", authMiddleware, MessageController.createMessage);
router.get(
  "/conversation/:conversationId",
  authMiddleware,
  MessageController.getConversationMessages
);
router.delete("/:messageId", authMiddleware, MessageController.deleteMessage);

module.exports = router;
