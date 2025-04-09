const Message = require("../models/Message");

class MessageService {
  static async createMessage(conversationId, senderId, text) {
    const newMessage = new Message({
      conversationId,
      senderId,
      text,
    });

    return newMessage.save();
  }

  static async getConversationMessages(conversationId) {
    return Message.find({
      conversationId: conversationId,
    })
      .populate("senderId", "username email")
      .sort({ createdAt: 1 });
  }

  static async deleteMessage(messageId) {
    await Message.findByIdAndDelete(messageId);
    return { message: "Message supprimé avec succès" };
  }
}

module.exports = MessageService;
