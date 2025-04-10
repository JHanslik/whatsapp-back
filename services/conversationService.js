const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

class ConversationService {
  static async createConversation(participants) {
    // Vérifier si une conversation existe déjà entre ces participants
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants },
    });

    if (existingConversation) {
      return existingConversation;
    }

    const newConversation = new Conversation({ participants });
    return newConversation.save();
  }

  static async getUserConversations(userId) {
    return Conversation.find({
      participants: userId,
    }).populate("participants", "firstName lastName phone");
  }

  static async deleteConversation(conversationId) {
    await Conversation.findByIdAndDelete(conversationId);
    // Supprimer également tous les messages associés
    await Message.deleteMany({ conversationId: conversationId });
    return { message: "Conversation supprimée avec succès" };
  }
}

module.exports = ConversationService;
