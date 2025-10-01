import express from "express";
import { importerJeuxQuebec, listerJeuxQuebec} from "../controllers/jeuController.js";

const router = express.Router();

// Import Koha -> Mongo
router.get("/import/quebec", importerJeuxQuebec);
// Lister ceux déjà en Mongo
router.get("/quebec", listerJeuxQuebec);

export default router;
