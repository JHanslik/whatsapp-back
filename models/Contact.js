const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contactId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  alias: {
    type: String,
    // Nom personnalisé facultatif
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index composé pour retrouver rapidement les contacts d'un utilisateur
contactSchema.index({ ownerId: 1 });
// Index pour éviter les doublons
contactSchema.index({ ownerId: 1, contactId: 1 }, { unique: true });

module.exports = mongoose.model("Contact", contactSchema);
