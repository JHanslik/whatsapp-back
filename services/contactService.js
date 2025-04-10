const Contact = require("../models/Contact");
const User = require("../models/User");

class ContactService {
  static async addContact(userId, contactId) {
    // Log pour debug
    console.log("Données reçues:", { userId, contactId });

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Vérifier si le contact existe dans la base de données
    const contactUser = await User.findById(contactId);
    if (!contactUser) {
      throw new Error("Le contact n'existe pas dans l'application");
    }

    // Vérifier si le contact existe déjà pour cet utilisateur
    const existingContact = await Contact.findOne({
      ownerId: userId,
      contactId: contactId,
    });

    if (existingContact) {
      throw new Error("Ce contact existe déjà");
    }

    // Créer le nouveau contact
    const contact = new Contact({
      ownerId: userId,
      contactId: contactId,
    });

    await contact.save();

    // Populate les informations du contact
    return Contact.findById(contact._id).populate(
      "contactId",
      "firstName lastName phone"
    );
  }

  static async getUserContacts(userId) {
    return Contact.find({
      ownerId: userId,
    }).populate("contactId", "firstName lastName phone");
  }

  static async deleteContact(contactId) {
    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
      throw new Error("Contact non trouvé");
    }
    return { message: "Contact supprimé avec succès" };
  }

  static async updateContactAlias(contactId, alias) {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw new Error("Contact non trouvé");
    }

    contact.alias = alias;
    await contact.save();

    return Contact.findById(contactId).populate(
      "contactId",
      "firstName lastName phone"
    );
  }
}

module.exports = ContactService;
