const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Créer un nouvel utilisateur
router.post("/register", async (req, res) => {
  try {
    const { phone, firstName, lastName, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Un utilisateur avec ce numéro existe déjà" });
    }

    // Créer le nouvel utilisateur
    const user = new User({
      phone,
      firstName,
      lastName,
      password, // Le mot de passe sera haché automatiquement par le middleware pre-save
    });

    await user.save();

    // Ne pas renvoyer le mot de passe dans la réponse
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ajouter une route de connexion
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Trouver l'utilisateur par numéro de téléphone
    const user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Numéro de téléphone ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Numéro de téléphone ou mot de passe incorrect" });
    }

    // Ne pas renvoyer le mot de passe dans la réponse
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir un utilisateur par son numéro de téléphone
router.get("/search/:phone", async (req, res) => {
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

// Modifier un utilisateur par son ID
router.put("/:id", async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    // Si un nouveau mot de passe est fourni, le hacher
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Rechercher et mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Ne pas renvoyer le mot de passe dans la réponse
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir le profil d'un utilisateur par son ID
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
