const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const hashPassword = require("../middleware/passwordMiddleware");

const userSchema = new Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Utiliser le middleware externe pour le hachage du mot de passe
userSchema.pre("save", hashPassword);

// Méthode pour comparer le mot de passe saisi avec le mot de passe haché
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
