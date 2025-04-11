const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const normalizePhoneMiddleware = require("../middleware/phoneMiddleware");
const hashPasswordMiddleware = require("../middleware/passwordMiddleware");
const { uploadMiddleware } = require("../services/cloudinary");

// Routes publiques
router.post(
  "/register",
  normalizePhoneMiddleware,
  hashPasswordMiddleware,
  UserController.registerUser
);
router.post("/login", normalizePhoneMiddleware, UserController.loginUser);

// Routes protégées
router.get(
  "/search/:phone",
  normalizePhoneMiddleware,
  UserController.searchUserByPhone
);
router.get("/profile/:id", authMiddleware, UserController.getUserProfile);
router.put(
  "/:id",
  authMiddleware,
  normalizePhoneMiddleware,
  hashPasswordMiddleware,
  UserController.updateUser
);

router.post(
  "/profile-image",
  authMiddleware,
  uploadMiddleware,
  UserController.updateProfileImage
);

// Route alternative avec userId en paramètre
router.post(
  "/profile-image/:userId",
  authMiddleware,
  uploadMiddleware,
  UserController.updateProfileImage
);

module.exports = router;
