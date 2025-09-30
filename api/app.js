import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import jeuxRoutes from "./routes/jeux.js";

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" Connecté à MongoDB"))
.catch(err => console.error(" Erreur MongoDB:", err.message));

app.use(express.json());

app.use("/api/jeux", jeuxRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Serveur lancé sur http://localhost:${PORT}`);
});
