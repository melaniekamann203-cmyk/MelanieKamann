const isNonEmptyString = value => typeof value === "string" && value.trim().length > 0;

// Recorre las reglas de cada campo y devuelve la lista de errores.
// partial = true (PATCH): solo se validan los campos enviados, pero al menos uno debe venir.
function validate(body, rules, { partial = false } = {}) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return [{ field: "body", message: "must be a JSON object" }];
  }

  const errors = [];
  const sentFields = Object.keys(rules).filter(field => body[field] !== undefined);

  if (partial && sentFields.length === 0) {
    return [{ field: "body", message: `send at least one of: ${Object.keys(rules).join(", ")}` }];
  }

  for (const [field, rule] of Object.entries(rules)) {
    const value = body[field];

    if (value === undefined) {
      if (rule.required && !partial) errors.push({ field, message: "is required" });
      continue;
    }

    const message = rule.check(value);
    if (message) errors.push({ field, message });
  }

  return errors;
}

module.exports = { isNonEmptyString, validate };
