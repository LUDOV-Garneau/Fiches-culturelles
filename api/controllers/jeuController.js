import axios from "axios";
import Jeu from "../models/Jeu.js";
import { mapperKohaVersJeu, obtenirImage } from "../utils/kohaMappeur.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

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

/**
 * Exporter un jeu en PDF
 */
async function exporterJeuPdf(req, res) {
  try {
    const { id } = req.params;
    const jeu = await Jeu.findById(id);

    if (!jeu) {
      return res.status(404).json({
        success: false,
        message: "Jeu non trouvé.",
      });
    }

    const dossier = "exports";
    if (!fs.existsSync(dossier)) fs.mkdirSync(dossier);

    const filePath = path.join(dossier, `jeu_${jeu._id}.pdf`);
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // === TITRE ===
    doc
      .fontSize(22)
      .text(jeu.titreComplet.principal, { align: "center", underline: true })
      .moveDown(0.5);

    if (jeu.titreComplet.sousTitre)
      doc.fontSize(14).text(jeu.titreComplet.sousTitre, { align: "center" });

    doc.moveDown(1);

    // === INFORMATIONS GÉNÉRALES ===
    doc.fontSize(12);
    const infos = [
      ["Année de sortie", jeu.anneeSortie],
      ["Développeurs", jeu.developpeurs.join(", ")],
      ["Éditeurs", jeu.editeurs.join(", ")],
      ["Plateformes", jeu.plateformes.join(", ")],
      ["Langue", jeu.langue],
      ["Lieu de publication", jeu.lieuPublication],
      ["Éditeur principal", jeu.editeurPrincipal],
      ["Format / support", jeu.formatSupport],
    ];

    infos.forEach(([label, val]) => {
      if (val) doc.text(`${label} : ${val}`);
    });

    doc.moveDown(1);

    // === RÉSUMÉ ===
    if (jeu.resume?.fr || jeu.resume?.en) {
      doc.fontSize(14).text("Résumé", { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(12).text(jeu.resume.fr || jeu.resume.en);
      doc.moveDown(1);
    }

    // === NOTES ===
    if (jeu.resume?.notes) {
      const n = jeu.resume.notes;
      doc.fontSize(14).text("Notes", { underline: true }).moveDown(0.3);
      if (n.credits) doc.text(`Crédits : ${n.credits}`);
      if (n.autresEditions) doc.text(`Autres éditions : ${n.autresEditions}`);
      if (n.etiquettesGeneriques?.length)
        doc.text(`Étiquettes : ${n.etiquettesGeneriques.join(", ")}`);
      if (n.liensQuebec) doc.text(`Lien Québec : ${n.liensQuebec}`);
      doc.moveDown(1);
    }

    // === GENRES ===
    if (jeu.genres?.length) {
      doc.fontSize(14).text("Genres / Thèmes", { underline: true });
      jeu.genres.forEach((g) => {
        doc.fontSize(12).text(`• ${g.type} : ${g.valeur}`);
      });
      doc.moveDown(1);
    }

        // === CONTENU PHYSIQUE ===
    if (jeu.contenuPhysique?.length) {
      doc.fontSize(14).text("Contenu physique", { underline: true });
      doc.moveDown(0.3);
      jeu.contenuPhysique.forEach((c) => {
        const quantite = c.quantite || 1;
        const type = c.type || "Inconnu";
        const mat = c.materiaux ? ` (${c.materiaux})` : "";
        doc.fontSize(12).text(`• ${quantite} × ${type}${mat}`);
      });
      doc.moveDown(1);
    }

    // === RÉCOMPENSES ===
    if (jeu.recompenses?.length) {
      doc.fontSize(14).text("Récompenses", { underline: true });
      doc.moveDown(0.3);
      jeu.recompenses.forEach((r) => doc.fontSize(12).text(`• ${r}`));
      doc.moveDown(1);
    }

    // === SOURCES ===
    if (jeu.sources?.length) {
      doc.fontSize(14).text("Sources / Références", { underline: true });
      doc.moveDown(0.3);
      jeu.sources.forEach((s) => doc.fontSize(12).text(`• ${s}`));
      doc.moveDown(1);
    }


    // === IMAGE ===
    if (jeu.imageUrl) {
      try {
        const imgPath = path.join(dossier, `${jeu._id}.jpg`);
        const { data } = await axios.get(jeu.imageUrl, {
          responseType: "arraybuffer",
        });
        fs.writeFileSync(imgPath, data);
        doc.image(imgPath, { fit: [250, 250], align: "center" });
        fs.unlinkSync(imgPath);
      } catch {
        doc.text("Image non disponible.");
      }
      doc.moveDown(1);
    }

    // === FOOTER ===
    doc
      .fontSize(10)
      .moveDown(2)
      .text("Catalogue LUDOV - Jeux québécois", { align: "center" });

    doc.end();

    stream.on("finish", () => {
      res.download(filePath, `jeu_${jeu._id}.pdf`, () => {
        fs.unlinkSync(filePath);
      });
    });
  } catch (err) {
    console.error("Erreur exporterJeuPdf:", err.message);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la génération du PDF.",
      error: err.message,
    });
  }
}

export { exporterJeuPdf };


export { importerJeuxQuebec, getJeux, getJeu, deleteJeu, updateJeu };
