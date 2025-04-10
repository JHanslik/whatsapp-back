const bcrypt = require("bcrypt");

const comparePasswords = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  comparePasswords,
};
