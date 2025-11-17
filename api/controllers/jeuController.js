import axios from "axios";
import Jeu from "../models/Jeu.js";
import { mapperKohaVersJeu, obtenirImage } from "../utils/kohaMappeur.js";

/**
 * Importer les jeux liés au Québec depuis Koha et les sauvegarder en MongoDB
 */
async function importerJeuxQuebec(req, res) {
  try {
    const token = Buffer.from(
      `${process.env.KOHA_USERNAME}:${process.env.KOHA_PASSWORD}`,
    ).toString("base64");

    const maxId = 10000;
    let totalImported = 0;
    const batchOps = [];

    for (let id = 1; id <= maxId; id++) {
      try {
        const { data } = await axios.get(`${process.env.KOHA_API_URL}/${id}`, {
          headers: {
            Authorization: `Basic ${token}`,
            Accept: "application/json",
          },
        });

        if (!data) continue;

        // xtraction depuis Koha JSON
        const mapped = mapperKohaVersJeu(data);
        if (!mapped.estLieAuQuebec) continue;

        //Lecture MARC 
        const marc = await extraireDepuisMarc(id);
        if (marc) {
          // Titre 
          if (marc.titreComplet) mapped.titreComplet = marc.titreComplet;

          // Informations contextuelles
          mapped.langue = marc.langue || mapped.langue;
          mapped.lieuPublication = marc.lieuPublication || mapped.lieuPublication;
          mapped.editeurPrincipal = marc.editeurPrincipal || mapped.editeurPrincipal;
          mapped.anneeSortie = marc.annee || mapped.anneeSortie;
          mapped.plateformes = marc.plateforme ? [marc.plateforme] : mapped.plateformes;

          // Champs ++
          mapped.contenuPhysique = marc.contenuPhysique?.length ? marc.contenuPhysique : [];
          mapped.genres = marc.genres?.length ? marc.genres : [];
          mapped.recompenses = marc.recompenses?.length ? marc.recompenses : [];
          mapped.sources = marc.sources?.length ? marc.sources : [];

          // Fusion des notes MARC dans le résumé Koha 
          if (marc.resume?.notes) {
            const notesMarc = marc.resume.notes;
            if (!mapped.resume.notes) mapped.resume.notes = {};

            mapped.resume.notes = {
              credits: notesMarc.credits || mapped.resume.notes.credits || null,
              autresEditions: notesMarc.autresEditions || mapped.resume.notes.autresEditions || null,
              etiquettesGeneriques: notesMarc.etiquettesGeneriques?.length
                ? notesMarc.etiquettesGeneriques
                : mapped.resume.notes.etiquettesGeneriques || [],
              liensQuebec: notesMarc.liensQuebec || mapped.resume.notes.liensQuebec || null,
            };

            // Si le MARC signale un lien Québec, on le conserve
            if (notesMarc.liensQuebec) mapped.estLieAuQuebec = true;
          }

          //Fusion des URLs (Koha + MARC)
          if (marc.urls?.length) {
            const toutes = new Set([...(mapped.urls || []), ...marc.urls]);
            mapped.urls = Array.from(toutes);
          }
        }

        //Image IGDB
        const titreImage = mapped.titreComplet?.principal || mapped.titre;
        mapped.imageUrl = await obtenirImage(titreImage);

        // upsert Mongo
        batchOps.push({
          updateOne: {
            filter: {
              "identifiantsExternes.kohaBiblioId":
                mapped.identifiantsExternes.kohaBiblioId,
            },
            update: { $set: mapped },
            upsert: true,
          },
        });

        console.log(`Québec ID ${id} : ${titreImage}`);
        console.log(`Image : ${mapped.imageUrl}`);

        // --- Sauvegarde par batch ---
        if (batchOps.length >= 50) {
          await Jeu.bulkWrite(batchOps);
          totalImported += batchOps.length;
          batchOps.length = 0;
        }
      } catch (err) {
        if (err.response?.status === 404) {
          console.log(`Pas de notice pour ID ${id}`);
        } else {
          console.error(`Erreur ID ${id}:`, err.message);
        }
      }
    }

    // Dernier batch restant
    if (batchOps.length > 0) {
      await Jeu.bulkWrite(batchOps);
      totalImported += batchOps.length;
    }

    res.json({
      success: true,
      imported: totalImported,
      message: `${totalImported} jeux québécois importés`,
    });
  } catch (err) {
    console.error("Erreur importerJeuxQuebec:", err.message);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'import des jeux québécois",
      error: err.message,
    });
  }
}

/**
 * Lister les jeux québécois déjà stockés en MongoDB
 */
async function getJeux(req, res) {
  try {
    const jeux = await Jeu.find({ estLieAuQuebec: true }).sort({
      anneeSortie: -1,
    });
    res.json({ success: true, count: jeux.length, data: jeux });
  } catch (err) {
    console.error("Erreur listerJeuxQuebec:", err.message);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la lecture en BD",
    });
  }
}

/**
 * Liste un jeu spécifique
 */
async function getJeu(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "L'ID du jeu est obligatoire.",
      });
    }

    const jeu = await Jeu.findById(id);

    if (!jeu) {
      return res.status(404).json({
        success: false,
        message: "Jeu non trouvé.",
      });
    }

    res.json({
      success: true,
      data: jeu,
    });
  } catch (err) {
    console.error("Erreur getJeu:", err.message);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la lecture en BD",
    });
  }
}


/**
 * Supprimer un jeu par son ID
 */
async function deleteJeu(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "L'ID du jeu est obligatoire.",
      });
    }

    const jeu = await Jeu.findByIdAndDelete(id);

    if (!jeu) {
      return res.status(404).json({
        success: false,
        message: "Jeu non trouvé.",
      });
    }

    res.json({
      success: true,
      message: `Jeu '${jeu.titre}' supprimé avec succès.`,
    });
  } catch (err) {
    console.error("Erreur deleteJeu:", err.message);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression en BD.",
    });
  }
}

/**
 * Modifier un jeu par son ID
 */
async function updateJeu(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "L'ID du jeu est obligatoire.",
      });
    }

    const jeu = await Jeu.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!jeu) {
      return res.status(404).json({
        success: false,
        message: "Jeu non trouvé.",
      });
    }

    res.json({
      success: true,
      message: `Jeu '${jeu.titre}' mis à jour avec succès.`,
      data: jeu,
    });
  } catch (err) {
    console.error("Erreur updateJeu:", err.message);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour en BD.",
    });
  }
}

export { importerJeuxQuebec, getJeux, getJeu, deleteJeu, updateJeu };
