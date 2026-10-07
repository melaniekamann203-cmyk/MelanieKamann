const { Pool } = require("pg");
const { DATABASE_URL, DB } = require("../config/env");

// En producción se usa DATABASE_URL; en local, las variables DB_*
const pool = new Pool(
  DATABASE_URL
    ? { connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : DB
);

module.exports = {
  query: (text, params) => pool.query(text, params),
  close: () => pool.end()
};
