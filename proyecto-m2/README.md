# Bitácora API

API REST para gestionar **autores** y **publicaciones** de un blog, construida con Node.js, Express y PostgreSQL.
Proyecto Integrador del Módulo 2.

## Tecnologías

- **Node.js** + **Express 5**: servidor y rutas
- **PostgreSQL** + **pg**: base de datos y conexión
- **dotenv**: variables de entorno
- **swagger-ui-express**: documentación interactiva (OpenAPI 3)
- **node:test** + **Supertest**: tests automatizados

## Estructura

```text
proyecto-m2/
├── docs/openapi.json          # Documentación OpenAPI 3
├── sql/
│   ├── schema.sql             # Tablas, relaciones e índices
│   └── seed.sql               # Datos de ejemplo
├── src/
│   ├── config/env.js          # Lectura de variables de entorno
│   ├── db/index.js            # Pool de conexiones a PostgreSQL
│   ├── models/                # Consultas SQL (autores y posts)
│   ├── validators/            # Validación de los datos del body
│   ├── controllers/           # Lógica de cada endpoint
│   ├── routes/                # Definición de rutas
│   ├── middlewares/           # validateId, notFound, errorHandler
│   ├── utils/HttpError.js     # Error con status HTTP
│   ├── app.js                 # Configuración de Express
│   └── server.js              # Arranque del servidor
├── tests/api.test.js
├── .env.example
└── package.json
```

La responsabilidad está separada en capas: **rutas → controladores → modelos**. Los controladores lanzan un `HttpError` y un único `errorHandler` arma todas las respuestas de error.

## Instalación

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear el archivo `.env` copiando `.env.example` y completar los datos de PostgreSQL.
3. Crear la base de datos y cargar las tablas y los datos de ejemplo:
   ```bash
   createdb -U postgres bitacora
   npm run db:setup
   ```
   (o ejecutar `sql/schema.sql` y `sql/seed.sql` desde pgAdmin)
4. Iniciar el servidor:
   ```bash
   npm start        # producción
   npm run dev      # desarrollo, se reinicia al guardar
   ```

La API queda en `http://localhost:3000` y la documentación en `http://localhost:3000/docs`.

## Modelo de datos

| authors | | posts | |
|---|---|---|---|
| `id` | SERIAL PK | `id` | SERIAL PK |
| `name` | VARCHAR(100) | `author_id` | FK → authors (ON DELETE CASCADE) |
| `email` | VARCHAR(150) UNIQUE | `title` | VARCHAR(200) |
| `bio` | TEXT | `content` | TEXT |
| `created_at` | TIMESTAMPTZ | `published` | BOOLEAN (default false) |
| | | `created_at` / `updated_at` | TIMESTAMPTZ |

Un autor tiene muchos posts. Si se elimina un autor, se eliminan sus posts.

## Endpoints

### Sistema
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Estado del servidor y de la base de datos |
| GET | `/docs` | Documentación Swagger |

### Autores
| Método | Ruta | Descripción | Éxito |
|---|---|---|---|
| GET | `/authors` | Listar autores (`?search=` busca por nombre) | 200 |
| GET | `/authors/:id` | Obtener un autor | 200 |
| GET | `/authors/:id/posts` | Autor junto con sus posts | 200 |
| POST | `/authors` | Crear un autor | 201 |
| PUT | `/authors/:id` | Reemplazar un autor | 200 |
| PATCH | `/authors/:id` | Actualizar algunos campos | 200 |
| DELETE | `/authors/:id` | Eliminar un autor y sus posts | 204 |

### Publicaciones
| Método | Ruta | Descripción | Éxito |
|---|---|---|---|
| GET | `/posts` | Listar posts, más recientes primero (`?published=true\|false`, `?author_id=`) | 200 |
| GET | `/posts/:id` | Obtener un post (incluye datos del autor) | 200 |
| GET | `/posts/author/:authorId` | Posts de un autor | 200 |
| POST | `/posts` | Crear un post (borrador por defecto) | 201 |
| PUT | `/posts/:id` | Reemplazar un post | 200 |
| PATCH | `/posts/:id` | Actualizar algunos campos (ej. `{ "published": true }`) | 200 |
| DELETE | `/posts/:id` | Eliminar un post | 204 |

### Errores

Todos los errores responden en JSON con el formato `{ "error": "mensaje" }`. Los de validación agregan `details` con el problema de cada campo:

```json
{
  "error": "invalid author data",
  "details": [
    { "field": "email", "message": "must be a valid email" }
  ]
}
```

| Status | Cuándo |
|---|---|
| 400 | id no numérico, body inválido, JSON mal formado, `author_id` inexistente |
| 404 | El autor, el post o la ruta no existen |
| 409 | El email ya está registrado |
| 500 | Error inesperado del servidor |

### Ejemplos

```bash
# Crear un autor
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana Torres","email":"ana@mail.com","bio":"Escribe sobre diseño"}'

# Crear un borrador y después publicarlo
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"author_id":1,"title":"Mi post","content":"Hola mundo"}'

curl -X PATCH http://localhost:3000/posts/6 \
  -H "Content-Type: application/json" \
  -d '{"published":true}'

# Solo los posts publicados de un autor
curl "http://localhost:3000/posts?author_id=1&published=true"
```

## Tests

```bash
npm test
```

27 tests de integración con Supertest que cubren el CRUD completo de autores y posts, los filtros, las validaciones, los status codes y el borrado en cascada. Usan la base de datos configurada en `.env` y eliminan los datos que crean.

## Deploy

La app lee `DATABASE_URL` si existe (Railway, Render, etc.), así que para desplegarla basta con:

1. Crear un servicio de PostgreSQL y ejecutar `sql/schema.sql` y `sql/seed.sql`.
2. Crear el servicio de la app desde el repositorio, con esta carpeta como *Root Directory*.
3. Definir la variable `DATABASE_URL` con la conexión de la base de datos.

## Uso de IA

El detalle de cómo se usó la inteligencia artificial durante el desarrollo está en [docs/uso-ia.md](docs/uso-ia.md).
