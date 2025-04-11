const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Vérification des variables d'environnement
console.log("Configuration Cloudinary :");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log(
  "API_KEY:",
  process.env.CLOUDINARY_API_KEY ? "Définie" : "Non définie"
);
console.log(
  "API_SECRET:",
  process.env.CLOUDINARY_API_SECRET ? "Définie" : "Non définie"
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "whatsapp-profiles",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
    format: "jpg",
    resource_type: "auto",
  },
});

// Configuration de multer avec gestion des erreurs
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite à 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error("Seuls les fichiers JPG et PNG sont autorisés!"),
        false
      );
    }
    cb(null, true);
  },
}).single("profileImage"); // Configurer pour un seul fichier

// Wrapper pour gérer les erreurs de multer
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Erreur Multer:", err);
      return res.status(400).json({
        message: "Erreur lors du téléchargement",
        error: err.message,
      });
    }
    next();
  });
};

module.exports = { cloudinary, uploadMiddleware };
