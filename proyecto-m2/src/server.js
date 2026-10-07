const app = require("./app");
const { PORT } = require("./config/env");

app.listen(PORT, () => {
  console.log(`Bitácora API escuchando en http://localhost:${PORT}`);
  console.log(`Documentación en http://localhost:${PORT}/docs`);
});
