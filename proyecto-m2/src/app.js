const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapi = require("../docs/openapi.json");
const routes = require("./routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

// Log simple de cada request: método, ruta, status y duración
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (process.env.NODE_ENV !== "test") {
      console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`);
    }
  });
  next();
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.use(routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
