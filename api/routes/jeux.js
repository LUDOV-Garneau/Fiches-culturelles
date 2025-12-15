import express from "express";
import {
  importerJeuxQuebec,
  getJeux,
  getJeu,
  deleteJeu,
  updateJeu,
  exporterJeuPdf,
} from "../controllers/jeuController.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = express.Router();

router.get("/", getJeux);
router.get("/:id", getJeu);
router.get("/:id/pdf", exporterJeuPdf);

router.get("/import/quebec", authAdmin, importerJeuxQuebec);
router.delete("/:id", authAdmin, deleteJeu);
router.put("/:id", authAdmin, updateJeu);

export default router;