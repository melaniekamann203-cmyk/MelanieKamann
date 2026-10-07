require("dotenv").config({ quiet: true });

module.exports = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  // SSL activado por defecto con DATABASE_URL; DB_SSL=false lo desactiva (ej. red interna de Railway)
  DB_SSL: process.env.DB_SSL !== "false",
  DB: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "bitacora",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD
  }
};
