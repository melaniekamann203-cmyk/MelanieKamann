const db = require("../db");

// Todas las consultas usan parámetros ($1, $2...): los datos nunca se concatenan al SQL

// Cada post se devuelve con un resumen de su autor
const SELECT_WITH_AUTHOR = `
  SELECT p.*,
         json_build_object('id', a.id, 'name', a.name, 'email', a.email) AS author
  FROM posts p
  JOIN authors a ON a.id = p.author_id
`;

// Los filtros son opcionales: si llegan en null, esa condición no filtra nada
async function findAll({ authorId = null, published = null } = {}) {
  const { rows } = await db.query(
    `${SELECT_WITH_AUTHOR}
     WHERE ($1::int IS NULL OR p.author_id = $1)
       AND ($2::boolean IS NULL OR p.published = $2)
     ORDER BY p.created_at DESC, p.id DESC`,
    [authorId, published]
  );
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

async function update(id, { author_id, title, content, published = false }) {
  const { rows } = await db.query(
    `UPDATE posts
     SET author_id = $1, title = $2, content = $3, published = $4, updated_at = NOW()
     WHERE id = $5
     RETURNING id`,
    [author_id, title, content, published, id]
  );
  return rows[0] ? findById(id) : null;
}

async function remove(id) {
  const { rowCount } = await db.query("DELETE FROM posts WHERE id = $1", [id]);
  return rowCount > 0;
}

module.exports = { findAll, findById, create, update, remove };
