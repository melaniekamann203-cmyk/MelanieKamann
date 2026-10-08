const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Array de películas en memoria
let movies = [
  { id: 1, title: "Inception", year: 2010, genre: "Sci-Fi" },
  { id: 2, title: "The Matrix", year: 1999, genre: "Sci-Fi" },
  { id: 3, title: "Pulp Fiction", year: 1994, genre: "Crime" },
  { id: 4, title: "The Shawshank Redemption", year: 1994, genre: "Drama" },
  { id: 5, title: "The Dark Knight", year: 2008, genre: "Action" }
];

const SORTABLE_FIELDS = ["id", "title", "year", "genre"];

// GET /movies - Listar películas
// Query params opcionales: genre, year, search, sort (ej: sort=year o sort=-year)
app.get("/movies", (req, res) => {
  const { genre, year, search, sort } = req.query;

  let result = [...movies];

  // Filtro por género (case-insensitive)
  if (genre) {
    result = result.filter(m => m.genre.toLowerCase() === genre.toLowerCase());
  }

  // Filtro por año
  if (year) {
    const yearNumber = Number(year);

    if (Number.isNaN(yearNumber)) {
      return res.status(400).json({ error: "year must be a number" });
    }

    result = result.filter(m => m.year === yearNumber);
  }

  // Búsqueda por título (coincidencia parcial, case-insensitive)
  if (search) {
    result = result.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));
  }

  // Ordenamiento: "year" ascendente, "-year" descendente
  if (sort) {
    const sortField = sort.replace("-", "");
    const sortOrder = sort.startsWith("-") ? -1 : 1;

    if (!SORTABLE_FIELDS.includes(sortField)) {
      return res.status(400).json({
        error: `sort must be one of: ${SORTABLE_FIELDS.join(", ")}`
      });
    }

    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * sortOrder;
      if (a[sortField] > b[sortField]) return 1 * sortOrder;
      return 0;
    });
  }

  res.status(200).json(result);
});

// GET /movies/stats - Estadísticas del catálogo
// Va ANTES de /movies/:id; si no, Express tomaría "stats" como un :id
app.get("/movies/stats", (req, res) => {
  const total = movies.length;
  const genres = [...new Set(movies.map(m => m.genre))];
  const averageYear = total === 0
    ? null
    : Number((movies.reduce((sum, m) => sum + m.year, 0) / total).toFixed(1));

  res.status(200).json({ total, genres, averageYear });
});

// GET /movies/:id - Obtener una película por ID
app.get("/movies/:id", (req, res) => {
  const id = Number(req.params.id);

  // Validar que sea número
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "id must be a number" });
  }

  // Buscar película
  const movie = movies.find(m => m.id === id);

  // Si no existe
  if (!movie) {
    return res.status(404).json({ error: "movie not found" });
  }

  // Si existe
  res.status(200).json(movie);
});

// Rutas no definidas
app.use((req, res) => {
  res.status(404).json({ error: "route not found" });
});

// Errores inesperados
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
