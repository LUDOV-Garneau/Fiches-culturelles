const express = require("express");
const app = express();

app.get("/api", (req, res) => {
  res.send("Backend en ligne (route /api)");
});

app.listen(3000, () => {
  console.log("Serveur démarre sur http://localhost:3000");
});