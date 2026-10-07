const Post = require("../models/post.model");
const Author = require("../models/author.model");
const HttpError = require("../utils/HttpError");
const { validatePost, cleanPost } = require("../validators/post.validator");

function assertValid(body, options) {
  const errors = validatePost(body, options);
  if (errors.length) throw new HttpError(400, "invalid post data", errors);
}

// Convierte los query params de GET /posts en filtros válidos
function parseFilters(query) {
  const filters = {};

  if (query.author_id !== undefined) {
    const authorId = Number(query.author_id);
    if (!Number.isInteger(authorId) || authorId <= 0) {
      throw new HttpError(400, "author_id must be a positive integer");
    }
    filters.authorId = authorId;
  }

  if (query.published !== undefined) {
    if (query.published !== "true" && query.published !== "false") {
      throw new HttpError(400, "published must be true or false");
    }
    filters.published = query.published === "true";
  }

  return filters;
}

// GET /posts?published=true&author_id=1
exports.list = async (req, res) => {
  const posts = await Post.findAll(parseFilters(req.query));
  res.status(200).json(posts);
};

// GET /posts/:id
exports.getOne = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new HttpError(404, "post not found");
  res.status(200).json(post);
};

// GET /posts/author/:authorId
exports.listByAuthor = async (req, res) => {
  const author = await Author.findById(req.params.authorId);
  if (!author) throw new HttpError(404, "author not found");
  res.status(200).json(await Post.findAll({ authorId: author.id }));
};

// POST /posts
exports.create = async (req, res) => {
  assertValid(req.body);
  const post = await Post.create(cleanPost(req.body));
  res.status(201).location(`/posts/${post.id}`).json(post);
};

// PUT /posts/:id (reemplazo completo: published no enviado vuelve a false)
exports.replace = async (req, res) => {
  assertValid(req.body);
  const post = await Post.update(req.params.id, { published: false, ...cleanPost(req.body) });
  if (!post) throw new HttpError(404, "post not found");
  res.status(200).json(post);
};

// PATCH /posts/:id (ej: { "published": true } para publicar un borrador)
exports.patch = async (req, res) => {
  assertValid(req.body, { partial: true });
  const post = await Post.update(req.params.id, cleanPost(req.body));
  if (!post) throw new HttpError(404, "post not found");
  res.status(200).json(post);
};

// DELETE /posts/:id
exports.remove = async (req, res) => {
  const deleted = await Post.remove(req.params.id);
  if (!deleted) throw new HttpError(404, "post not found");
  res.status(204).send();
};
