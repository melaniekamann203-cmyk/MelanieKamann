# Uso de inteligencia artificial

Proyecto Integrador 2: Bitácora API

Usé **Claude (Claude Code)** como asistente durante el desarrollo. A continuación están los prompts principales, en orden, y cómo influyó cada uno en el proyecto.

> Revisá y completá las secciones marcadas con ✏️ con tu experiencia antes de entregar.

## Prompts utilizados

### 1. Punto de partida

> "Necesito que me ayudes en base a este repositorio [proyecto de una compañera] que por favor me ayudes a armar un proyecto así de igual pero no tan parecido."

**Resultado:** la IA identificó que el repositorio de referencia resolvía la misma consigna (autores y posts con Express y PostgreSQL) y propuso una implementación propia con otra arquitectura:

- CommonJS en lugar de ES Modules.
- Una clase `HttpError` y un único `errorHandler` en vez de respuestas de error repetidas en cada controlador.
- Validadores reutilizables que devuelven el error de cada campo.
- Un middleware `validateId` para responder 400 ante IDs no numéricos.
- `PATCH` además de `PUT`, filtros por query (`?published`, `?author_id`, `?search`) y el endpoint `/health`.
- La documentación OpenAPI en JSON y los tests con `node:test` y Supertest.

### 2. Revisión contra la guía de Henry

> "Necesito que me ayudes con una auditoría en base al proyecto" (junto con la guía oficial del Proyecto Integrador 2).

**Resultado:** se compararon los puntos de la guía con el código y se corrigió lo siguiente:

- **Queries sin concatenar strings:** los `UPDATE` y los filtros armaban el SQL concatenando nombres de columna. Se reescribieron como consultas fijas con `$1`, `$2`… y el `PATCH` pasó a combinar el registro actual con los campos nuevos.
- **Organización:** la carpeta `models/` pasó a llamarse `services/`, como recomienda la guía.
- **Tests:** se agregaron los casos de "eliminar recurso inexistente" que pide la guía.
- **Scripts SQL:** `schema.sql` pasó a llamarse `setup.sql`.

### 3. Auditoría contra la rúbrica

> [Rúbrica oficial del Proyecto Integrador 2, criterio por criterio]

**Resultado:**

- **OpenAPI:** la especificación no pasaba la validación de Redocly (faltaba declarar `security`). Se corrigió y se agregaron `operationId` y descripciones.
- **Schema:** se reforzó con `CHECK` para el formato y las minúsculas del email y para que el contenido no quede vacío.
- **Conexión:** se agregó manejo de errores en el pool de conexiones y la opción `DB_SSL` para Railway.
- **Inicialización:** se creó `npm run db:init` para inicializar la base sin depender de `psql`.
- **README:** se documentaron los pasos del deploy en Railway.

## Cómo verifiqué lo que generó la IA

- Ejecuté los scripts SQL y probé las restricciones directamente en PostgreSQL (email inválido, email duplicado, autor inexistente, contenido vacío).
- Probé cada endpoint con curl y Swagger UI, revisando el status code y el JSON de cada caso.
- Ejecuté la suite de tests (`npm test`): 31 tests en verde.
- Validé la documentación con `npx @redocly/cli lint docs/openapi.json`.
- ✏️ _Agregá acá cómo lo probaste vos (Thunder Client, Postman, pgAdmin) y capturas si las tenés._

## Qué aprendí

- ✏️ _Por ejemplo: por qué las consultas parametrizadas (`$1`) evitan la inyección SQL._
- ✏️ _La diferencia entre PUT (reemplazo completo) y PATCH (actualización parcial)._
- ✏️ _Qué hace `ON DELETE CASCADE` y por qué conviene validar también en la base de datos._
- ✏️ _Cuándo usar 400, 404, 409 y 500._
