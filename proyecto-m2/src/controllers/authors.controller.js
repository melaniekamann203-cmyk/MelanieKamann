const Author = require("../models/author.model");
const Post = require("../models/post.model");
const HttpError = require("../utils/HttpError");
const { validateAuthor, cleanAuthor } = require("../validators/author.validator");

async function getAuthorOr404(id) {
  const author = await Author.findById(id);
  if (!author) throw new HttpError(404, "author not found");
  return author;
}

function assertValid(body, options) {
  const errors = validateAuthor(body, options);
  if (errors.length) throw new HttpError(400, "invalid author data", errors);
}

// GET /authors?search=texto
exports.list = async (req, res) => {
  const authors = await Author.findAll({ search: req.query.search });
  res.status(200).json(authors);
};

// GET /authors/:id
exports.getOne = async (req, res) => {
  res.status(200).json(await getAuthorOr404(req.params.id));
};

// GET /authors/:id/posts
exports.listPosts = async (req, res) => {
  const author = await getAuthorOr404(req.params.id);
  const posts = await Post.findAll({ authorId: author.id });
  res.status(200).json({ author, posts });
};

// POST /authors
exports.create = async (req, res) => {
  assertValid(req.body);
  const author = await Author.create(cleanAuthor(req.body));
  res.status(201).location(`/authors/${author.id}`).json(author);
};

// PUT /authors/:id (reemplazo completo: bio no enviada queda en null)
exports.replace = async (req, res) => {
  assertValid(req.body);
  const data = { bio: null, ...cleanAuthor(req.body) };
  const author = await Author.update(req.params.id, data);
  if (!author) throw new HttpError(404, "author not found");
  res.status(200).json(author);
};

// PATCH /authors/:id (actualización parcial)
exports.patch = async (req, res) => {
  assertValid(req.body, { partial: true });
  const author = await Author.update(req.params.id, cleanAuthor(req.body));
  if (!author) throw new HttpError(404, "author not found");
  res.status(200).json(author);
};

// DELETE /authors/:id (sus posts se borran en cascada)
exports.remove = async (req, res) => {
  const deleted = await Author.remove(req.params.id);
  if (!deleted) throw new HttpError(404, "author not found");
  res.status(204).send();
};
