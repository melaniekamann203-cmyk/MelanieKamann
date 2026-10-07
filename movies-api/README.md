# Movies API

Backend de una plataforma de recomendación de películas, hecho con Express. Los datos se guardan en memoria, en un array.

## Cómo ejecutarlo

```bash
npm install
npm start      # o: npm run dev (se reinicia al guardar cambios)
```

El servidor queda en `http://localhost:3000`. Para usar otro puerto: `PORT=3001 npm start`.

## Endpoints

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/movies` | 200 + array de películas |
| GET | `/movies/:id` | 200 + película · 400 si el id no es número · 404 si no existe |
| GET | `/movies/stats` | 200 + `{ total, genres, averageYear }` |

### Query params de `/movies` (se pueden combinar)

| Param | Ejemplo | Qué hace |
|---|---|---|
| `genre` | `?genre=Sci-Fi` | Filtra por género, sin distinguir mayúsculas |
| `year` | `?year=1999` | Filtra por año (400 si no es número) |
| `search` | `?search=matrix` | Busca por texto en el título |
| `sort` | `?sort=year` / `?sort=-year` | Ordena ascendente o descendente (`id`, `title`, `year`, `genre`) |

## Pruebas con curl

```bash
curl http://localhost:3000/movies
curl http://localhost:3000/movies/1
curl -i http://localhost:3000/movies/abc      # 400
curl -i http://localhost:3000/movies/999      # 404
curl "http://localhost:3000/movies?genre=Sci-Fi"
curl "http://localhost:3000/movies?genre=Sci-Fi&year=1999"
curl "http://localhost:3000/movies?sort=-year"
curl "http://localhost:3000/movies?search=matrix"
curl http://localhost:3000/movies/stats
```

Todos los errores tienen el formato `{ "error": "..." }`.
