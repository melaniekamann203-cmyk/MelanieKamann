// Crea las tablas y carga los datos de ejemplo usando la conexión del .env
// Uso: npm run db:init     -> reinicia la base (borra y vuelve a crear todo)
//      npm run db:ensure   -> solo inicializa si las tablas todavía no existen
//                             (seguro para correr en cada deploy de Railway)
const fs = require("fs");
const path = require("path");
const db = require("../src/db");

const FILES = ["setup.sql", "seed.sql"];
const onlyIfEmpty = process.argv.includes("--if-empty");

async function tablesExist() {
  const { rows } = await db.query("SELECT to_regclass('public.authors') IS NOT NULL AS exists");
  return rows[0].exists;
}

async function main() {
  if (onlyIfEmpty && (await tablesExist())) {
    console.log("✓ Las tablas ya existen: no se modifica la base");
    return;
  }

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
