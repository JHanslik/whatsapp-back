const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

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

// Méthode pour hacher le mot de passe avant l'enregistrement
userSchema.pre("save", async function (next) {
  // Ne hache le mot de passe que s'il a été modifié (ou est nouveau)
  if (!this.isModified("password")) return next();

  try {
    // Générer un sel
    const salt = await bcrypt.genSalt(10);
    // Hacher le mot de passe avec le sel
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer le mot de passe saisi avec le mot de passe haché
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
