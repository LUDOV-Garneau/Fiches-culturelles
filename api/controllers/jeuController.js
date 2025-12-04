import axios from "axios";
import Jeu from "../models/Jeu.js";
import { mapperKohaVersJeu, obtenirImage, extraireDepuisMarc } from "../utils/kohaMappeur.js";
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

        // extraction depuis Koha JSON
        const mapped = mapperKohaVersJeu(data);
        if (!mapped.estLieAuQuebec) continue;

        // Lecture MARC
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
          mapped.contenuPhysique = marc.contenuPhysique?.length
            ? marc.contenuPhysique
            : mapped.contenuPhysique;

          mapped.genres = marc.genres?.length
            ? marc.genres
            : mapped.genres;

          mapped.recompenses = marc.recompenses?.length
            ? marc.recompenses
            : mapped.recompenses;

          // Sections 588 (sources + LUDOV)
          mapped.sources = marc.sources?.length ? marc.sources : mapped.sources || [];

          mapped.critiques = marc.critiques?.length
            ? marc.critiques
            : mapped.critiques || [];

          mapped.paratextes = marc.paratextes?.length
            ? marc.paratextes
            : mapped.paratextes || [];

          mapped.autresSources = marc.autresSources?.length
            ? marc.autresSources
            : mapped.autresSources || [];

          mapped.ressourcesLudov = marc.ressourcesLudov?.length
            ? marc.ressourcesLudov
            : mapped.ressourcesLudov || [];

          mapped.documentsReference = marc.documentsReference?.length
            ? marc.documentsReference
            : mapped.documentsReference || [];

          // Autres remarques
          if (marc.autresRemarques) {
            mapped.autresRemarques = marc.autresRemarques;
          }

          // --- Fusion intelligente des notes ---
          if (marc.resume?.notes) {
            const notesMarc = marc.resume.notes;

            // Création si absent
            if (!mapped.resume.notes) {
              mapped.resume.notes = {
                credits: null,
                autresEditions: null,
                etiquettesGeneriques: [],
                liensQuebec: null,
              };
            }

            // Remplissage sans écraser
            if (notesMarc.credits)
              mapped.resume.notes.credits = notesMarc.credits;

            if (notesMarc.autresEditions)
              mapped.resume.notes.autresEditions = notesMarc.autresEditions;

            if (Array.isArray(notesMarc.etiquettesGeneriques) &&
              notesMarc.etiquettesGeneriques.length > 0)
              mapped.resume.notes.etiquettesGeneriques = notesMarc.etiquettesGeneriques;

            if (notesMarc.liensQuebec) {
              mapped.resume.notes.liensQuebec = notesMarc.liensQuebec;
              mapped.estLieAuQuebec = true;
            }
          }

          // Fusion URLs
          if (marc.urls?.length) {
            mapped.urls = Array.from(new Set([...(mapped.urls || []), ...marc.urls]));
          }
        }


        // Image IGDB
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
      return res.status(404).json({ success: false, message: "Jeu non trouvé." });
    }

    const dossier = "exports";
    if (!fs.existsSync(dossier)) fs.mkdirSync(dossier);

    const nomFichierJeu = jeu.titreComplet.principal
      .replace(/[^a-zA-Z0-9_\- ]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 80);
    const nomPdf = `${nomFichierJeu || "jeu"}.pdf`;
    const filePath = path.join(dossier, nomPdf);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // === EN-TÊTE BLEU FONCÉ ===
    doc.rect(0, 0, doc.page.width, 60).fill("#2C3E50");
    doc.fillColor("#ECF0F1").fontSize(20).text("Catalogue LUDOV - Jeu Québécois", 50, 20);
    doc.moveDown(2);
    doc.fillColor("black");

    // === TITRE ===
    doc.fontSize(22).fillColor("#1A5276").text(jeu.titreComplet.principal, { align: "center" });
    if (jeu.titreComplet.sousTitre) {
      doc.fontSize(14).fillColor("#34495E").text(jeu.titreComplet.sousTitre, { align: "center" });
    }
    doc.moveDown(1.5);

    // === IMAGE (centrée) ===
    if (jeu.imageUrl) {
      try {
        const imgPath = path.join(dossier, `${jeu._id}.jpg`);
        const { data } = await axios.get(jeu.imageUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, data);
        doc.image(imgPath, { fit: [200, 200], align: "center" });
        fs.unlinkSync(imgPath);
        doc.moveDown(1);
      } catch {
        doc.fillColor("#7F8C8D").text("(Image non disponible)", { align: "center" });
        doc.moveDown(1);
      }
    }

    // === SECTION INFO GÉNÉRALES ===
    doc.fontSize(16).fillColor("#1A5276").text("Informations générales", { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor("black");

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
      doc.fontSize(16).fillColor("#1A5276").text("Résumé", { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(12).fillColor("black");
      doc.text(jeu.resume.fr || jeu.resume.en, { align: "justify" });
      doc.moveDown(1);
    }

    // === NOTES ===
    if (jeu.resume?.notes) {
      const n = jeu.resume.notes;
      doc.fontSize(16).fillColor("#1A5276").text("Notes", { underline: true });
      doc.moveDown(0.4);

      const maxWidth = 500;

      // Fonction utilitaire pour mise en forme
      const renderNote = (label, text) => {
        if (!text) return;
        doc.fontSize(12)
          .fillColor("#154360")
          .font("Helvetica-Bold")
          .text(`${label}`, { continued: true })
          .fillColor("black")
          .font("Helvetica")
          .text(` ${text}`, {
            width: maxWidth,
            align: "justify",
            indent: 15,
          });
        doc.moveDown(0.6);
      };

      renderNote("Crédits :", n.credits);
      renderNote("Autres éditions :", n.autresEditions);
      if (n.etiquettesGeneriques?.length)
        renderNote("Étiquettes :", n.etiquettesGeneriques.join(", "));
      renderNote("Lien Québec :", n.liensQuebec);

      doc.moveDown(0.5);
    }

    // === GENRES ===
    if (jeu.genres?.length) {
      doc.fontSize(16).fillColor("#1A5276").text("Genres / Thèmes", { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(12).fillColor("black");
      jeu.genres.forEach((g) => {
        doc.text(`• ${g.type} : ${g.valeur}`);
      });
      doc.moveDown(1);
    }

    // === CONTENU PHYSIQUE ===
    if (jeu.contenuPhysique?.length) {
      doc.fontSize(16).fillColor("#1A5276").text("Contenu physique", { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(12).fillColor("black");
      jeu.contenuPhysique.forEach((c) => {
        const quantite = c.quantite || 1;
        const type = c.type || "Inconnu";
        const mat = c.materiaux ? ` (${c.materiaux})` : "";
        doc.text(`• ${quantite} × ${type}${mat}`);
      });
      doc.moveDown(1);
    }

    // === RÉCOMPENSES ===
    if (jeu.recompenses?.length) {
      doc.fontSize(16).fillColor("#1A5276").text("Récompenses", { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(12).fillColor("black");
      jeu.recompenses.forEach((r) => doc.text(`• ${r}`));
      doc.moveDown(1);
    }

    // === SOURCES / RÉFÉRENCES ===
    if (jeu.sources?.length) {
      doc.fontSize(16).fillColor("#1A5276").text("Sources / Références", { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#2C3E50");
      jeu.sources.forEach((s) => doc.text(`• ${s}`, { width: 500 }));
      doc.moveDown(1);
    }

    // === PIED DE PAGE ===
    doc.moveDown(2);
    doc.rect(0, doc.page.height - 40, doc.page.width, 40).fill("#2C3E50");
    doc.fillColor("white").fontSize(10)
      .text("Catalogue LUDOV - Jeux québécois", 50, doc.page.height - 30, { align: "center" });

    doc.end();

    stream.on("finish", () => {
      res.download(filePath, nomPdf, () => {
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

export { importerJeuxQuebec, getJeux, getJeu, deleteJeu, updateJeu, exporterJeuPdf };
