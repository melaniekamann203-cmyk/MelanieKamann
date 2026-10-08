const { Pool } = require("pg");
const { DATABASE_URL, DB, DB_SSL } = require("../config/env");

// En producción (Railway) se usa DATABASE_URL; en local, las variables DB_*
const pool = new Pool(
  DATABASE_URL
    ? { connectionString: DATABASE_URL, ssl: DB_SSL ? { rejectUnauthorized: false } : false }
    : DB
);

// Un error en una conexión inactiva no debe tirar abajo el servidor
pool.on("error", err => {
  console.error("Error inesperado en el pool de PostgreSQL:", err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  close: () => pool.end()
};
