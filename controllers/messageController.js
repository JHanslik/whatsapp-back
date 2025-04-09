const MessageService = require("../services/messageService");

class MessageController {
  static async createMessage(req, res) {
    try {
      const { conversationId, senderId, text } = req.body;
      const savedMessage = await MessageService.createMessage(
        conversationId,
        senderId,
        text
      );
      res.status(201).json(savedMessage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getConversationMessages(req, res) {
    try {
      const messages = await MessageService.getConversationMessages(
        req.params.conversationId
      );
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteMessage(req, res) {
    try {
      const result = await MessageService.deleteMessage(req.params.messageId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = MessageController;
