const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Configuration de Socket.IO avec CORS
const io = new Server(server, {
  cors: {
    origin: "*", // En développement. À restreindre en production
    methods: ["GET", "POST"],
  },
});

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

// Configuration Socket.IO
io.on("connection", (socket) => {
  console.log("Un client est connecté");

  // Rejoindre une conversation
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`Client rejoint la conversation: ${conversationId}`);
  });

  // Quitter une conversation
  socket.on("leaveConversation", (conversationId) => {
    socket.leave(conversationId);
    console.log(`Client quitte la conversation: ${conversationId}`);
  });

  // Recevoir un nouveau message
  socket.on("sendMessage", async (messageData) => {
    try {
      const { conversationId, senderId, text } = messageData;

      // Émettre le message à tous les clients dans la conversation
      io.to(conversationId).emit("newMessage", {
        conversationId,
        senderId,
        text,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client déconnecté");
  });
});

// Démarrage du serveur
server.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Serveur démarré sur le port ${PORT}`);
  }
});
