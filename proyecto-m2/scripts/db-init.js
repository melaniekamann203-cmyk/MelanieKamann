// Crea las tablas y carga los datos de ejemplo usando la conexión del .env
// Uso: npm run db:init   (en local o apuntando a Railway con DATABASE_URL)
const fs = require("fs");
const path = require("path");
const db = require("../src/db");

const FILES = ["setup.sql", "seed.sql"];

async function main() {
  for (const file of FILES) {
    const sql = fs.readFileSync(path.join(__dirname, "..", "sql", file), "utf8");
    await db.query(sql);
    console.log(`✓ ${file} ejecutado`);
  }
}

main()
  .catch(err => {
    console.error("✗ No se pudo inicializar la base de datos:", err.message);
    process.exitCode = 1;
  })
  .finally(() => db.close());
