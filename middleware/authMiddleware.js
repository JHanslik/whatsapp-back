const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("Aucun token d'authentification fourni");
      // Au lieu de bloquer, on continue avec un champ user null
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Erreur de vérification du token:", error.message);
    // Au lieu de bloquer, on continue avec un champ user null
    req.user = null;
    next();
  }
};

module.exports = authMiddleware;
