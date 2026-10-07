# Explorador de archivos

Herramienta de línea de comandos en Node.js que lista y analiza los archivos del directorio de usuario (`os.homedir()`). Solo usa módulos nativos (`fs/promises`, `os`, `path`), así que no hay dependencias que instalar.

## Scripts disponibles

- `npm start`: lista los archivos y carpetas del directorio de usuario
- `npm run list:detailed`: muestra el tipo, el tamaño y la fecha de modificación, y al final un resumen
- `npm run list:filter`: muestra solo los archivos `.js`, con su tamaño
- `npm run dev`: modo desarrollo con `node --watch`, que se reinicia al editar el código

## Argumentos opcionales (desafíos extra)

```bash
npm start -- ./otra-carpeta              # listar otro directorio
npm run list:detailed -- ./otra-carpeta
npm run list:filter -- .txt              # filtrar por otra extensión
npm run list:filter -- .json ./carpeta   # extensión y directorio
```

## Estructura

- `index.js`: listado básico
- `detallado.js`: listado detallado (usa `fs.stat` en paralelo con `Promise.all`)
- `filtrar.js`: filtro por extensión
- `utils.js`: funciones compartidas (formatear tamaños y fechas, ordenar, elegir el directorio)

Los listados se ordenan alfabéticamente. Si un archivo no se puede leer, se informa y se sigue con los demás.
