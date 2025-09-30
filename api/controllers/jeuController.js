import axios from "axios";
import Jeu from "../models/Jeu.js";
import { mapperKohaVersJeu } from "../utils/kohaMappeur.js";

/**
 * Importer les jeux liés au Québec depuis Koha et les sauvegarder en MongoDB
 */
async function importerJeuxQuebec(req, res) {
 try {
    const token = Buffer.from(
      `${process.env.KOHA_USERNAME}:${process.env.KOHA_PASSWORD}`
    ).toString("base64");

    const maxId = 10000;
    let totalImported = 0;
    const batchOps = [];

    for (let id = 1; id <= maxId; id++) {
      try {
        const { data } = await axios.get(
          `${process.env.KOHA_API_URL}/${id}`,
          {
            headers: {
              Authorization: `Basic ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (data) {
          const mapped = mapperKohaVersJeu(data);

          if (mapped.estLieAuQuebec) {
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

            console.log(`Québec ID ${id} : ${mapped.titre}`);
          }
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.log(` Pas de notice pour ID ${id}`);
        } else {
          console.error(`Erreur ID ${id}:`, err.message);
        }
      }

      if (batchOps.length >= 50) {
        await Jeu.bulkWrite(batchOps);
        totalImported += batchOps.length;
        batchOps.length = 0;
      }
    }

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
      message: "Erreur lors de l'import Québec",
      error: err.message,
    });
  }
}


/**
 * Lister les jeux québécois déjà stockés en MongoDB
 */
async function listerJeuxQuebec(req, res) {
  try {
    const jeux = await Jeu.find({ estLieAuQuebec: true }).sort({ anneeSortie: -1 });
    res.json({ success: true, count: jeux.length, data: jeux });
  } catch (err) {
    console.error("Erreur listerJeuxQuebec:", err.message);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la lecture en BD",
    });
  }
}


export  { importerJeuxQuebec, listerJeuxQuebec };
