const { isNonEmptyString, validate } = require("./helpers");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rules = {
  name: {
    required: true,
    check: v => (isNonEmptyString(v) && v.trim().length <= 100 ? null : "must be a non-empty string (max 100 chars)")
  },
  email: {
    required: true,
    check: v => (typeof v === "string" && EMAIL_REGEX.test(v.trim()) ? null : "must be a valid email")
  },
  bio: {
    required: false,
    check: v => (v === null || typeof v === "string" ? null : "must be a string or null")
  }
};

// Normaliza los campos enviados (trim y email en minúsculas)
function clean(body) {
  const data = {};
  if (body.name !== undefined) data.name = body.name.trim();
  if (body.email !== undefined) data.email = body.email.trim().toLowerCase();
  if (body.bio !== undefined) data.bio = body.bio === null ? null : body.bio.trim();
  return data;
}

module.exports = {
  validateAuthor: (body, options) => validate(body, rules, options),
  cleanAuthor: clean
};
