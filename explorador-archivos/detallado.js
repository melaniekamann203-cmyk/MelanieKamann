const fs = require('fs/promises');
const path = require('path');
const {
  obtenerDirectorio,
  formatearTamano,
  formatearFecha,
  ordenarAlfabeticamente
} = require('./utils');

async function listarDetallado() {
  try {
    // Uso: node detallado.js [directorio]
    const directorio = obtenerDirectorio(process.argv[2]);
    const items = ordenarAlfabeticamente(await fs.readdir(directorio));

    console.log(`Contenido detallado de: ${directorio}\n`);
    console.log(`${'TIPO'.padEnd(10)}${'TAMAÑO'.padStart(10)}   ${'MODIFICADO'.padEnd(22)}NOMBRE`);
    console.log('-'.repeat(70));

    let totalArchivos = 0;
    let totalDirectorios = 0;
    let tamanoTotal = 0;

    // stat de todos los items en paralelo; si uno falla no detiene a los demás
    const resultados = await Promise.all(
      items.map(async item => {
        try {
          const stats = await fs.stat(path.join(directorio, item));
          return { item, stats };
        } catch (error) {
          return { item, error };
        }
      })
    );

    for (const { item, stats, error } of resultados) {
      if (error) {
        console.log(`${'ERROR'.padEnd(10)}${'-'.padStart(10)}   ${'-'.padEnd(22)}${item} (${error.code || error.message})`);
        continue;
      }

      const esDirectorio = stats.isDirectory();
      const tipo = esDirectorio ? 'DIR' : 'ARCHIVO';
      const tamano = esDirectorio ? '-' : formatearTamano(stats.size);

      if (esDirectorio) {
        totalDirectorios++;
      } else {
        totalArchivos++;
        tamanoTotal += stats.size;
      }

      console.log(`${tipo.padEnd(10)}${tamano.padStart(10)}   ${formatearFecha(stats.mtime).padEnd(22)}${item}`);
    }

    console.log('-'.repeat(70));
    console.log(`Archivos: ${totalArchivos} | Directorios: ${totalDirectorios} | Tamaño total: ${formatearTamano(tamanoTotal)}`);
  } catch (error) {
    console.log('Error:', error.message);
  }
}

listarDetallado();
