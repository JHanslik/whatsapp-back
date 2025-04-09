const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const User = require("../models/User");

// Ajouter un nouveau contact
router.post("/add", async (req, res) => {
  try {
    const { userId, contactId } = req.body;

    // Log pour debug
    console.log("Données reçues:", { userId, contactId });

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si le contact existe dans la base de données
    const contactUser = await User.findById(contactId);
    if (!contactUser) {
      return res
        .status(404)
        .json({ message: "Le contact n'existe pas dans l'application" });
    }

    // Vérifier si le contact existe déjà pour cet utilisateur
    const existingContact = await Contact.findOne({
      ownerId: userId,
      contactId: contactId,
    });

    if (existingContact) {
      return res.status(400).json({ message: "Ce contact existe déjà" });
    }

    // Créer le nouveau contact
    const contact = new Contact({
      ownerId: userId,
      contactId: contactId,
    });

    await contact.save();

    // Populate les informations du contact
    const populatedContact = await Contact.findById(contact._id).populate(
      "contactId",
      "firstName lastName phone"
    );

    res.status(201).json(populatedContact);
  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
});

// Obtenir tous les contacts d'un utilisateur
router.get("/user/:userId", async (req, res) => {
  try {
    const contacts = await Contact.find({
      ownerId: req.params.userId,
    }).populate("contactId", "firstName lastName phone");
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supprimer un contact
router.delete("/:contactId", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact non trouvé" });
    }
    res.json({ message: "Contact supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
