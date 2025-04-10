/**
 * Middleware Express pour normaliser les numéros de téléphone
 * Convertit les formats +33XXXXXXXXX en 0XXXXXXXXX
 */
const normalizePhoneMiddleware = (req, res, next) => {
  try {
    // Normaliser le numéro dans le body (pour register/login)
    if (req.body.phone) {
      if (req.body.phone.startsWith("+33")) {
        req.body.phone = "0" + req.body.phone.slice(3);
      } else if (!req.body.phone.startsWith("0")) {
        req.body.phone = "0" + req.body.phone;
      }
    }

    // Normaliser le numéro dans les paramètres (pour search)
    if (req.params.phone) {
      if (req.params.phone.startsWith("+33")) {
        req.params.phone = "0" + req.params.phone.slice(3);
      } else if (!req.params.phone.startsWith("0")) {
        req.params.phone = "0" + req.params.phone;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = normalizePhoneMiddleware;
