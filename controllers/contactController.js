const ContactService = require("../services/contactService");

class ContactController {
  static async addContact(req, res) {
    try {
      const { userId, contactId } = req.body;
      const contact = await ContactService.addContact(userId, contactId);
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUserContacts(req, res) {
    try {
      const contacts = await ContactService.getUserContacts(req.params.userId);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteContact(req, res) {
    try {
      const result = await ContactService.deleteContact(req.params.contactId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateContactAlias(req, res) {
    try {
      const { contactId } = req.params;
      const { alias } = req.body;
      const contact = await ContactService.updateContactAlias(contactId, alias);
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ContactController;
