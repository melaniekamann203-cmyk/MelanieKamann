const fs = require('fs/promises');
const { obtenerDirectorio, ordenarAlfabeticamente } = require('./utils');

async function listarDirectorio() {
  try {
    // Uso: node index.js [directorio]
    const directorio = obtenerDirectorio(process.argv[2]);
    const items = await fs.readdir(directorio, { withFileTypes: true });

    console.log(`Contenido de: ${directorio}\n`);

    const nombres = ordenarAlfabeticamente(items.map(item => item.name));
    const esDirectorio = new Set(items.filter(item => item.isDirectory()).map(item => item.name));

    for (const nombre of nombres) {
      const icono = esDirectorio.has(nombre) ? '📁' : '📄';
      console.log(`${icono} ${nombre}`);
    }

    console.log(`\nTotal: ${items.length} elementos`);
  } catch (error) {
    console.log('Error:', error.message);
  }
}

listarDirectorio();
