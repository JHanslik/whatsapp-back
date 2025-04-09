const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Envoyer un nouveau message
router.post("/", async (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;
    const newMessage = new Message({
      conversationId,
      senderId,
      text,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Récupérer tous les messages d'une conversation
router.get("/conversation/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .populate("senderId", "username email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supprimer un message
router.delete("/:messageId", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.messageId);
    res.status(200).json({ message: "Message supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
