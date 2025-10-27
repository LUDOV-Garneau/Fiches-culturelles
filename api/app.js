import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import jeuxRoutes from "./routes/jeux.js";

const app = express();

app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" Connecté à MongoDB"))
.catch(err => console.error(" Erreur MongoDB:", err.message));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend en ligne (route /api) - test déploiement !");
});

app.use("/jeux", jeuxRoutes);

export default app; 
// Jest nécessite qu'on sépare app et server pour fonctionner 
// Source: https://www.albertgao.com/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
