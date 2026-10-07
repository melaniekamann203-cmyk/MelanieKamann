const HttpError = require("../utils/HttpError");

// Valida que req.params[paramName] sea un entero positivo y lo deja convertido a número
module.exports = (paramName = "id") => (req, res, next) => {
  const value = Number(req.params[paramName]);

  if (!Number.isInteger(value) || value <= 0) {
    return next(new HttpError(400, `${paramName} must be a positive integer`));
  }

  req.params[paramName] = value;
  next();
};
