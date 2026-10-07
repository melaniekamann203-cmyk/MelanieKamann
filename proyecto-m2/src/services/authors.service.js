const db = require("../db");

// Todas las consultas usan parámetros ($1, $2...): los datos nunca se concatenan al SQL

async function findAll({ search } = {}) {
  const { rows } = await db.query(
    `SELECT * FROM authors
     WHERE $1::text IS NULL OR name ILIKE '%' || $1 || '%'
     ORDER BY id`,
    [search || null]
  );
  return rows;
}

async function findById(id) {
  const { rows } = await db.query("SELECT * FROM authors WHERE id = $1", [id]);
  return rows[0] || null;
}

async function create({ name, email, bio = null }) {
  const { rows } = await db.query(
    "INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *",
    [name, email, bio]
  );
  return rows[0];
}

async function update(id, { name, email, bio = null }) {
  const { rows } = await db.query(
    "UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *",
    [name, email, bio, id]
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await db.query("DELETE FROM authors WHERE id = $1", [id]);
  return rowCount > 0;
}

module.exports = { findAll, findById, create, update, remove };
