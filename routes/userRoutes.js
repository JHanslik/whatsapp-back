const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Créer un nouvel utilisateur
router.post('/register', async (req, res) => {
  try {
    const { phone, firstName, lastName } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Un utilisateur avec ce numéro existe déjà" });
    }

    // Créer le nouvel utilisateur
    const user = new User({
      phone,
      firstName,
      lastName
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir un utilisateur par son numéro de téléphone
router.get('/search/:phone', async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
