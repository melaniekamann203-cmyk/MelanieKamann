const { isNonEmptyString, validate } = require("./helpers");

const rules = {
  author_id: {
    required: true,
    check: v => (Number.isInteger(v) && v > 0 ? null : "must be a positive integer")
  },
  title: {
    required: true,
    check: v => (isNonEmptyString(v) && v.trim().length <= 200 ? null : "must be a non-empty string (max 200 chars)")
  },
  content: {
    required: true,
    check: v => (isNonEmptyString(v) ? null : "must be a non-empty string")
  },
  published: {
    required: false,
    check: v => (typeof v === "boolean" ? null : "must be a boolean")
  }
};

function clean(body) {
  const data = {};
  if (body.author_id !== undefined) data.author_id = body.author_id;
  if (body.title !== undefined) data.title = body.title.trim();
  if (body.content !== undefined) data.content = body.content.trim();
  if (body.published !== undefined) data.published = body.published;
  return data;
}

module.exports = {
  validatePost: (body, options) => validate(body, rules, options),
  cleanPost: clean
};
