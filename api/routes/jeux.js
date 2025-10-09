import express from "express";
import { importerJeuxQuebec, getJeux, getJeu} from "../controllers/jeuController.js";

const router = express.Router();

// Import Koha -> Mongo
router.get("/import/quebec", importerJeuxQuebec);

// Obtenir tout les jeux
router.get("/jeux", getJeux);

// Obtenir un jeu précis
router.get("/jeux/:titre", getJeu);

export default router;
