const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connection à MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("MongoDB connecté");
    }
  })
  .catch((err) => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Erreur de connexion MongoDB:", err);
    }
  });

// Importation des modèles
const User = require("./models/User");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");
const Contact = require("./models/Contact");

// Importation des routes
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Routes de base
app.get("/", (req, res) => {
  res.send("API WhatsApp est en ligne!");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
  }
});
