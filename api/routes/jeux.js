import express from "express";
import { importerJeuxQuebec, getJeux, getJeu, deleteJeu, updateJeu} from "../controllers/jeuController.js";

const router = express.Router();

// Import Koha -> Mongo
router.get("/import/quebec", importerJeuxQuebec);

// Obtenir tout les jeux
router.get("/", getJeux);

// Obtenir un jeu précis
router.get("/:titre", getJeu);

// Supprimer un jeu précis
router.delete("/:id", deleteJeu);

// Mettre à jour un jeu précis
router.put("/:id", updateJeu);

export default router;
