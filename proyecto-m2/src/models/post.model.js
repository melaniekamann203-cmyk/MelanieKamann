const db = require("../db");

// Cada post se devuelve con un resumen de su autor
const SELECT_WITH_AUTHOR = `
  SELECT p.*,
         json_build_object('id', a.id, 'name', a.name, 'email', a.email) AS author
  FROM posts p
  JOIN authors a ON a.id = p.author_id
`;

async function findAll({ authorId, published } = {}) {
  const conditions = [];
  const params = [];

  if (authorId !== undefined) {
    params.push(authorId);
    conditions.push(`p.author_id = $${params.length}`);
  }

  if (published !== undefined) {
    params.push(published);
    conditions.push(`p.published = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { rows } = await db.query(`${SELECT_WITH_AUTHOR} ${where} ORDER BY p.created_at DESC, p.id DESC`, params);
  return rows;
}

async function findById(id) {
  const { rows } = await db.query(`${SELECT_WITH_AUTHOR} WHERE p.id = $1`, [id]);
  return rows[0] || null;
}

async function create({ author_id, title, content, published = false }) {
  const { rows } = await db.query(
    `INSERT INTO posts (author_id, title, content, published)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [author_id, title, content, published]
  );
  return findById(rows[0].id);
}

// Actualiza solo los campos recibidos y refresca updated_at
async function update(id, fields) {
  const columns = Object.keys(fields);
  const assignments = columns.map((column, i) => `${column} = $${i + 1}`);
  assignments.push("updated_at = NOW()");

  const { rows } = await db.query(
    `UPDATE posts SET ${assignments.join(", ")} WHERE id = $${columns.length + 1} RETURNING id`,
    [...Object.values(fields), id]
  );
  return rows[0] ? findById(id) : null;
}

async function remove(id) {
  const { rowCount } = await db.query("DELETE FROM posts WHERE id = $1", [id]);
  return rowCount > 0;
}

module.exports = { findAll, findById, create, update, remove };
