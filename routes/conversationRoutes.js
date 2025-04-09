const express = require("express");
const router = express.Router();
const ConversationController = require("../controllers/conversationController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes protégées par authentification
router.post("/", authMiddleware, ConversationController.createConversation);
router.get(
  "/user/:userId",
  authMiddleware,
  ConversationController.getUserConversations
);
router.delete(
  "/:conversationId",
  authMiddleware,
  ConversationController.deleteConversation
);

module.exports = router;
