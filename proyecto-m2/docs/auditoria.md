# Auditoría: Bitácora API frente a la rúbrica del Proyecto Integrador 2

Revisión criterio por criterio, con la evidencia verificada y los cambios aplicados.
Niveles: **Alto** = columna de máximo puntaje · **Medio** = cumple con detalles · **Bajo** = no cumple.

## Resumen

| # | Criterio | Nivel estimado |
|---|---|---|
| 1 | API REST: correctitud y consistencia | ✅ Alto |
| 2 | Modelado y persistencia en PostgreSQL | ✅ Alto |
| 3 | Integración Express + PostgreSQL | ✅ Alto |
| 4 | Validaciones y manejo de errores | ✅ Alto |
| 5 | Testing automatizado | ✅ Alto |
| 6a | Documentación (OpenAPI, README, `.env.example`) | ✅ Alto |
| 6b | Deploy en Railway con URL pública | ❌ Bajo: **falta desplegar** |

---

## 1. API REST: correctitud y consistencia

**Evidencia**
- CRUD completo de `authors` y `posts`, incluido `GET /posts/author/:authorId`.
- Extras: `PATCH` en ambos recursos, `GET /authors/:id/posts`, `GET /health` y filtros `?search`, `?published` y `?author_id`.
- Status codes consistentes: `200` para lectura y actualización, `201` para creación (con header `Location`), `204` para borrado, `400` para datos inválidos, `404` para recursos inexistentes, `409` para email duplicado y `500` para errores inesperados.
- Todas las respuestas son JSON. Los errores siempre usan el formato `{ "error": "..." }`.
- Las rutas no definidas responden 404 en JSON. `/posts/author/:authorId` está declarada antes que `/posts/:id` para evitar conflictos.

**Cambios aplicados:** ninguno necesario.

## 2. Modelado y persistencia en PostgreSQL

**Evidencia** (`sql/setup.sql` y `sql/seed.sql`)
- `SERIAL PRIMARY KEY` en las dos tablas.
- Relación 1:N con `author_id REFERENCES authors(id) ON DELETE CASCADE` y un índice sobre `author_id`.
- `NOT NULL` en todos los campos obligatorios y `UNIQUE` en `email`.
- Seed con 3 autores y 5 posts (publicados y borradores).
- Verificado en PostgreSQL 16: las inserciones inválidas son rechazadas por la base de datos.

**Cambios aplicados**
- Se agregaron `CHECK` para el formato del email, el email en minúsculas (unicidad sin importar mayúsculas) y el contenido no vacío.
- `schema.sql` pasó a llamarse `setup.sql`, como pide la guía.
- Se agregó `npm run db:init` para ejecutar el setup y el seed sin depender de `psql`, también contra Railway.

## 3. Integración Express + PostgreSQL

**Evidencia**
- `Pool` de `pg` centralizado en `src/db/index.js`.
- `async/await` en todos los services y controladores. Express 5 deriva los errores asíncronos al `errorHandler`.
- Separación en capas: `routes → controllers → services`, más `validators` y `middlewares`.
- Los errores de PostgreSQL se traducen a HTTP: `23505` → 409, `23503` → 400, `23514` → 400. Si la base está caída, la API responde 500 y `/health` responde 503 (verificado).

**Cambios aplicados**
- **Queries 100 % parametrizadas y fijas.** Antes, `UPDATE` y los filtros concatenaban fragmentos de SQL. Los valores ya iban parametrizados, pero la guía prohíbe concatenar.
- `models/` pasó a llamarse `services/`.
- Se agregó `pool.on("error")` para que una conexión caída no tire abajo el servidor.
- Se agregó la opción `DB_SSL` para Railway.

## 4. Validaciones y manejo de errores

**Evidencia**
- Validación de campos obligatorios, tipos y longitudes, con detalle por campo en `details`.
- Email: se valida el formato y la unicidad (409), que también está garantizada en la base de datos.
- `validateId` responde 400 ante `/authors/abc` o `/posts/-1`.
- JSON mal formado: 400. Body vacío en `PATCH`: 400.
- Un único middleware global de errores (`src/middlewares/errorHandler.js`), que no expone detalles internos en los 500.

> ℹ️ El email duplicado responde **409 Conflict**, que es el código semánticamente correcto. La rúbrica nombra 400, 404 y 500 como ejemplos; si el corrector esperara 400, basta con cambiar un número en `errorHandler.js`.

## 5. Testing automatizado

**Evidencia**
- **31 tests** con `node:test` y Supertest, que se ejecutan con `npm test`. La rúbrica pide al menos 6.
- Cubren el CRUD completo de los dos recursos, los filtros, el borrado en cascada y los casos de error: 400 por validación, ID inválido y JSON mal formado; 404 por recurso inexistente al obtener, actualizar y eliminar; 409 por email duplicado.
- Cada test crea sus propios datos y los elimina al terminar.

**Cambios aplicados:** se agregaron los tests de `DELETE` y `PATCH` sobre recursos inexistentes.

## 6a. Documentación

**Evidencia**
- `docs/openapi.json` (OpenAPI 3.0.3) servido con Swagger UI en `/docs`.
- `README.md` con instalación, variables de entorno, inicialización de la base, endpoints, ejemplos con curl, tests y deploy.
- `.env.example` incluido y `.env` excluido por `.gitignore` (verificado en el repositorio).
- `docs/uso-ia.md` con los prompts utilizados.

**Cambios aplicados**
- **La especificación OpenAPI no pasaba la validación** de Redocly (15 errores por falta de `security`). Corregido: ahora es válida, con `operationId`, descripciones de tags y licencia.
- Se agregó al README la guía paso a paso del deploy en Railway y cómo validar el OpenAPI.

## 6b. Deploy en Railway ❌

**Pendiente:** la aplicación todavía no está desplegada, así que este criterio hoy quedaría en el nivel más bajo. El código ya está preparado: lee `DATABASE_URL` y `PORT`, `npm run db:init` inicializa la base remota y el README tiene los pasos.

Para cerrarlo:
1. Seguir la sección **Deploy en Railway** del README.
2. Verificar `/health`, `/authors`, `/posts` y `/docs` en la URL pública.
3. Completar la URL en el README.

---

## Otros puntos a tener en cuenta

- **El proyecto está en una subcarpeta (`proyecto-m2/`)** de un repositorio con otras tareas, y en la rama `tareas-por-definir-hqrskw`. Conviene llevarlo a `main` o a un repositorio propio (por ejemplo `ProyectoM2_MelanieKamann`) para que el corrector lo encuentre sin vueltas.
- **Commits:** los cambios de la auditoría están en commits pequeños y descriptivos, pero el primer commit del proyecto fue uno solo grande.
- **`docs/uso-ia.md`** tiene secciones marcadas con ✏️ para completar con tu experiencia personal.
