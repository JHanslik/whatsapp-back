const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserService {
  static async registerUser(phone, firstName, lastName, password) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      throw new Error("Un utilisateur avec ce numéro existe déjà");
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

    return userResponse;
  }

  static async loginUser(phone, password) {
    // Trouver l'utilisateur par numéro de téléphone
    const user = await User.findOne({ phone });
    if (!user) {
      throw new Error("Numéro de téléphone ou mot de passe incorrect");
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Numéro de téléphone ou mot de passe incorrect");
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Ne pas renvoyer le mot de passe dans la réponse
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
  }

  static async searchUserByPhone(phone) {
    const user = await User.findOne({ phone });
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  }

  static async updateUser(id, updateData) {
    const { firstName, lastName, password } = updateData;
    const updateFields = {};

    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;

    // Si un nouveau mot de passe est fourni, le hacher
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Rechercher et mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error("Utilisateur non trouvé");
    }

    // Ne pas renvoyer le mot de passe dans la réponse
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return userResponse;
  }

  static async getUserProfile(id) {
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  }
}

module.exports = UserService;
