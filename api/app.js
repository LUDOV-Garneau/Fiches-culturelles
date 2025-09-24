const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Test API");
});

app.listen(3000, () => {
  console.log("Serveur démarre sur http://localhost:3000");
});