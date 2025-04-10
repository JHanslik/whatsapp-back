const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { comparePasswords } = require("./passwordService");

class UserService {
  // Fonction utilitaire pour normaliser les numéros de téléphone
  static normalizePhoneNumber(phone) {
    // Si le numéro commence par +33, le convertir en 0
    if (phone.startsWith("+33")) {
      return `0${phone.slice(3)}`;
    }
    // Si le numéro ne commence pas par 0, ajouter le 0
    if (!phone.startsWith("0")) {
      return `0${phone}`;
    }
    return phone;
  }

  static async registerUser(phone, firstName, lastName, password) {
    const normalizedPhone = this.normalizePhoneNumber(phone);
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ phone: normalizedPhone });
    if (existingUser) {
      throw new Error("Un utilisateur avec ce numéro existe déjà");
    }

    // Créer le nouvel utilisateur avec le numéro normalisé
    const user = new User({
      phone: normalizedPhone,
      firstName,
      lastName,
      password,
    });

    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    return userResponse;
  }

  static async loginUser(phone, password) {
    const user = await User.findOne({ phone });
    if (!user) {
      throw new Error("Numéro de téléphone ou mot de passe incorrect");
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      throw new Error("Numéro de téléphone ou mot de passe incorrect");
    }

    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
  }

  static async searchUserByPhone(phone) {
    const normalizedPhone = this.normalizePhoneNumber(phone);
    const user = await User.findOne({ phone: normalizedPhone });
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
