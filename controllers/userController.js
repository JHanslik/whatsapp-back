const UserService = require("../services/userService");
const User = require("../models/User");
const { cloudinary } = require("../services/cloudinary");

class UserController {
  static async registerUser(req, res) {
    try {
      const { phone, firstName, lastName, password } = req.body;
      const user = await UserService.registerUser(
        phone,
        firstName,
        lastName,
        password
      );
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async loginUser(req, res) {
    try {
      const { phone, password } = req.body;
      const user = await UserService.loginUser(phone, password);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async searchUserByPhone(req, res) {
    try {
      const user = await UserService.searchUserByPhone(req.params.phone);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async getUserProfile(req, res) {
    try {
      const user = await UserService.getUserProfile(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async updateProfileImage(req, res) {
    try {
      console.log("Début de updateProfileImage");
      console.log("Fichier reçu:", req.file);
      console.log("Corps de la requête:", req.body);
      console.log("Paramètres d'URL:", req.params);

      // Récupérer l'ID utilisateur soit du token, soit du body, soit des paramètres
      let userId = req.user?._id;

      // Si pas d'ID dans le token, utiliser de préférence les paramètres d'URL
      if (!userId && req.params.userId) {
        userId = req.params.userId;
        console.log("ID utilisateur récupéré des paramètres d'URL:", userId);
      }

      // Sinon, essayer de récupérer du formData (moins fiable avec multer)
      if (!userId && req.body.userId) {
        userId = req.body.userId;
        console.log("ID utilisateur récupéré du formData:", userId);
      }

      console.log("ID utilisateur final:", userId);

      if (!userId) {
        return res.status(400).json({ message: "ID utilisateur non fourni" });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Aucune image n'a été téléchargée" });
      }

      const user = await User.findById(userId);
      console.log("Utilisateur trouvé:", user ? "Oui" : "Non");

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Si l'utilisateur a déjà une image de profil, la supprimer de Cloudinary
      if (user.profileImage) {
        console.log("Suppression de l'ancienne image:", user.profileImage);
        const publicId = user.profileImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`whatsapp-profiles/${publicId}`);
      }

      // Mettre à jour l'URL de l'image dans la base de données
      console.log("Chemin du fichier uploadé:", req.file.path);
      user.profileImage = req.file.path;
      await user.save();
      console.log("Utilisateur mis à jour avec la nouvelle image");

      res.status(200).json({
        message: "Image de profil mise à jour avec succès",
        profileImage: user.profileImage,
      });
    } catch (error) {
      console.error(
        "Erreur détaillée lors de la mise à jour de l'image de profil:",
        error
      );
      res.status(500).json({
        message: "Erreur serveur",
        error: error.message,
      });
    }
  }
}

module.exports = UserController;
