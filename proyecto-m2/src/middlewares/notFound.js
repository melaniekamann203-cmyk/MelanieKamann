module.exports = (req, res) => {
  res.status(404).json({ error: `route ${req.method} ${req.originalUrl} not found` });
};
