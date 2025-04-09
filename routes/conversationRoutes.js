const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Créer une nouvelle conversation
router.post("/", async (req, res) => {
  try {
    const { participants } = req.body;

    // Vérifier si une conversation existe déjà entre ces participants
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants },
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const newConversation = new Conversation({ participants });
    const savedConversation = await newConversation.save();

    res.status(201).json(savedConversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Récupérer toutes les conversations d'un utilisateur
router.get("/user/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.params.userId,
    }).populate("participants", "username email");

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supprimer une conversation
router.delete("/:conversationId", async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.conversationId);
    // Supprimer également tous les messages associés
    await Message.deleteMany({ conversationId: req.params.conversationId });

    res.status(200).json({ message: "Conversation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
