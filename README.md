# Melanie Kamann · Desarrollo Web

Repositorio con mis proyectos y tareas del bootcamp de desarrollo web: desde una página con HTML y CSS hasta APIs REST con Node.js, Express y PostgreSQL.

## Proyectos

| Proyecto | Descripción | Tecnologías |
|---|---|---|
| [Bitácora API](proyecto-m2/) | **Proyecto Integrador del Módulo 2.** API REST para gestionar autores y publicaciones de un blog, con CRUD completo, validaciones, documentación Swagger y 27 tests automáticos. | Node.js, Express, PostgreSQL, Supertest, OpenAPI |
| [Movies API](movies-api/) | API para consultar un catálogo de películas, con filtros por género y año, búsqueda por título, ordenamiento y estadísticas. | Node.js, Express |
| [Explorador de archivos](explorador-archivos/) | Herramienta de línea de comandos que lista y analiza los archivos de un directorio usando npm scripts. | Node.js (`fs/promises`, `path`, `os`) |
| [Colorfly Studio](MelanieKamann.proyecto%20final.html) | Proyecto final de frontend: página web estática. | HTML, CSS |

Cada carpeta tiene su propio README con instrucciones de instalación y uso.

## Cómo ejecutar los proyectos de Node.js

```bash
cd nombre-del-proyecto
npm install
npm start
```

Bitácora API además necesita PostgreSQL; los pasos están en [proyecto-m2/README.md](proyecto-m2/README.md).

## Lo que aprendí

- Diferencia entre frontend y backend, y el modelo cliente-servidor
- Node.js: módulos, sistema de archivos, asincronía y npm scripts
- Diseño de APIs REST: rutas, métodos HTTP, status codes y respuestas JSON
- Express: rutas, middlewares, validaciones y manejo de errores
- Bases de datos relacionales con PostgreSQL
- Tests automatizados y documentación con OpenAPI/Swagger

## Contacto

- GitHub: [@melaniekamann203-cmyk](https://github.com/melaniekamann203-cmyk)
