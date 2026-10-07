const HttpError = require("../utils/HttpError");

// Códigos de error de PostgreSQL que son culpa del cliente, no del servidor
const PG_ERRORS = {
  "23505": [409, "email is already registered"],
  "23503": [400, "author_id does not reference an existing author"],
  "23514": [400, "a field has an invalid value"]
};

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (err instanceof HttpError) {
    const body = { error: err.message };
    if (err.details) body.details = err.details;
    return res.status(err.status).json(body);
  }

  // JSON mal formado en el body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "request body must be valid JSON" });
  }

  if (PG_ERRORS[err.code]) {
    const [status, message] = PG_ERRORS[err.code];
    return res.status(status).json({ error: message });
  }

  console.error(err);
  res.status(500).json({ error: "internal server error" });
};
