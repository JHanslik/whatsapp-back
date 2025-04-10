const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const normalizePhoneMiddleware = require("../middleware/phoneMiddleware");
const hashPasswordMiddleware = require("../middleware/passwordMiddleware");

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

module.exports = router;
