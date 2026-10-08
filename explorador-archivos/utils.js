const os = require('os');
const path = require('path');

// Directorio a explorar: el que se pase como argumento o, por defecto, el de usuario
function obtenerDirectorio(argumento) {
  return argumento ? path.resolve(argumento) : os.homedir();
}

// Convierte bytes a un formato legible (B, KB, MB, GB)
function formatearTamano(bytes) {
  const unidades = ['B', 'KB', 'MB', 'GB', 'TB'];
  let tamano = bytes;
  let i = 0;

  while (tamano >= 1024 && i < unidades.length - 1) {
    tamano /= 1024;
    i++;
  }

  return i === 0 ? `${tamano} ${unidades[i]}` : `${tamano.toFixed(1)} ${unidades[i]}`;
}

// Fecha en formato legible
function formatearFecha(fecha) {
  return fecha.toLocaleString('es-ES');
}

// Orden alfabético sin distinguir mayúsculas
function ordenarAlfabeticamente(lista) {
  return [...lista].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
}

module.exports = {
  obtenerDirectorio,
  formatearTamano,
  formatearFecha,
  ordenarAlfabeticamente
};
