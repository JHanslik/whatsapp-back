const bcrypt = require("bcrypt");

const hashPassword = async function (next) {
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
};

module.exports = hashPassword;
