const { Router } = require("express");
const db = require("../db");

const router = Router();

router.get("/", (req, res) => {
  res.json({
    name: "Bitácora API",
    docs: "/docs",
    resources: ["/authors", "/posts"]
  });
});

// Health check: confirma que el servidor y la base de datos responden
router.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).json({ status: "ok", database: "up", uptime: process.uptime() });
  } catch {
    res.status(503).json({ status: "error", database: "down" });
  }
});

router.use("/authors", require("./authors.routes"));
router.use("/posts", require("./posts.routes"));

module.exports = router;
