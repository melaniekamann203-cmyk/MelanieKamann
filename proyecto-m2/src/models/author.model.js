const db = require("../db");

async function findAll({ search } = {}) {
  if (search) {
    const { rows } = await db.query(
      "SELECT * FROM authors WHERE name ILIKE $1 ORDER BY id",
      [`%${search}%`]
    );
    return rows;
  }

  const { rows } = await db.query("SELECT * FROM authors ORDER BY id");
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

// Actualiza solo los campos recibidos (sirve para PUT y PATCH)
async function update(id, fields) {
  const columns = Object.keys(fields);
  const assignments = columns.map((column, i) => `${column} = $${i + 1}`).join(", ");

  const { rows } = await db.query(
    `UPDATE authors SET ${assignments} WHERE id = $${columns.length + 1} RETURNING *`,
    [...Object.values(fields), id]
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await db.query("DELETE FROM authors WHERE id = $1", [id]);
  return rowCount > 0;
}

module.exports = { findAll, findById, create, update, remove };
