const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes publiques
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

// Routes protégées par authentification
router.get("/search/:phone", authMiddleware, UserController.searchUserByPhone);
router.put("/:id", authMiddleware, UserController.updateUser);
router.get("/profile/:id", authMiddleware, UserController.getUserProfile);

module.exports = router;
