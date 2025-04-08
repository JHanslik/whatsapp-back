const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index composé sur les participants pour faciliter la recherche de conversations entre utilisateurs
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
