const fs = require('fs/promises');
const path = require('path');
const { obtenerDirectorio, formatearTamano, ordenarAlfabeticamente } = require('./utils');

async function filtrarPorExtension() {
  try {
    // Uso: node filtrar.js [extension] [directorio]   (por defecto: .js en el directorio de usuario)
    let extension = process.argv[2] || '.js';
    if (!extension.startsWith('.')) {
      extension = `.${extension}`;
    }
    const directorio = obtenerDirectorio(process.argv[3]);

    const items = ordenarAlfabeticamente(await fs.readdir(directorio));
    const encontrados = [];

    for (const item of items) {
      // Filtrar antes de hacer stat: los directorios no tienen extensión
      if (path.extname(item).toLowerCase() !== extension.toLowerCase()) {
        continue;
      }

      try {
        const stats = await fs.stat(path.join(directorio, item));
        if (stats.isFile()) {
          encontrados.push({ nombre: item, tamano: stats.size });
        }
      } catch (error) {
        console.log(`No se pudo leer ${item}: ${error.message}`);
      }
    }

    console.log(`Buscando archivos ${extension} en: ${directorio}\n`);

    if (encontrados.length === 0) {
      console.log(`No se encontraron archivos ${extension}`);
      return;
    }

    console.log(`Encontrados ${encontrados.length} archivos ${extension}:`);
    for (const archivo of encontrados) {
      console.log(`  - ${archivo.nombre} (${formatearTamano(archivo.tamano)})`);
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

filtrarPorExtension();
