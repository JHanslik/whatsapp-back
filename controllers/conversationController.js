const ConversationService = require("../services/conversationService");

class ConversationController {
  static async createConversation(req, res) {
    try {
      const { participants } = req.body;
      const conversation = await ConversationService.createConversation(
        participants
      );
      res.status(201).json(conversation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUserConversations(req, res) {
    try {
      const conversations = await ConversationService.getUserConversations(
        req.params.userId
      );
      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteConversation(req, res) {
    try {
      const result = await ConversationService.deleteConversation(
        req.params.conversationId
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ConversationController;
