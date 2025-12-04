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

    const nomFichierJeu = (jeu.titreComplet?.principal || "jeu")
      .replace(/[^a-zA-Z0-9_\- ]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 80);
    const nomPdf = `${nomFichierJeu}.pdf`;
    const filePath = path.join(dossier, nomPdf);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    //  EN-TÊTE 
    doc.rect(0, 0, doc.page.width, 60).fill("#2C3E50");
    doc
      .fillColor("#ECF0F1")
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("Catalogue LUDOV - Jeu québécois", 50, 20);
    doc.moveDown(2);
    doc.fillColor("black").font("Helvetica");

    // TITRE 
    let principal = (jeu.titreComplet?.principal || "Titre inconnu").trim();
    let sousTitre = (jeu.titreComplet?.sousTitre || "").trim();

    if (principal.endsWith(":")) {
      principal = principal.slice(0, -1).trim();
    }

    if (sousTitre.startsWith(":")) {
      sousTitre = sousTitre.slice(1).trim();
    }

    let titreComplet = principal;
    if (sousTitre) {
      titreComplet = `${principal} : ${sousTitre}`;
    }

    doc
      .moveDown(0.5)
      .fontSize(22)
      .fillColor("#1A5276")
      .font("Helvetica-Bold")
      .text(titreComplet, {
        align: "center",
        width: 500,
      });

    doc.moveDown(1.2);
    doc.fillColor("black").font("Helvetica");
    // IMAGE
    if (jeu.imageUrl) {
      try {
        const imgPath = path.join(dossier, `${jeu._id}.jpg`);
        const { data } = await axios.get(jeu.imageUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, data);

        doc.image(imgPath, {
          fit: [200, 200],
          align: "center",
          valign: "center",
        });

        fs.unlinkSync(imgPath);
        doc.moveDown(1);
      } catch {
        doc
          .fontSize(10)
          .fillColor("#7F8C8D")
          .text("(Image non disponible)", { align: "center" });
        doc.moveDown(1);
      }
    }

    //  utilitaire  
    const sectionTitle = (titre) => {
      doc
        .moveDown(0.8)
        .fontSize(16)
        .fillColor("#1A5276")
        .font("Helvetica-Bold")
        .text(titre, { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(12).fillColor("black").font("Helvetica");
    };

    // utilitaire : sous-titre 
    const subTitle = (titre) => {
      doc
        .moveDown(0.4)
        .fontSize(13)
        .fillColor("#154360")
        .font("Helvetica-Bold")
        .text(titre);
      doc.moveDown(0.2);
      doc.fontSize(12).fillColor("black").font("Helvetica");
    };

    // INFORMATIONS GÉNÉRALES 
    sectionTitle("Informations générales");

    const infos = [
      ["Année de sortie", jeu.anneeSortie],
      ["Développeurs", (jeu.developpeurs || []).join(", ") || null],
      ["Ville de développement", null],
      ["Éditeurs", (jeu.editeurs || []).join(", ") || null],
      ["Ville d’édition", jeu.lieuPublication || null],
      ["Plateforme", (jeu.plateformes || []).join(", ") || null],
      ["Langues", jeu.langue || null],
      ["Éditeur principal", jeu.editeurPrincipal || null],
      ["Format / support", jeu.formatSupport || null],
    ];

    infos.forEach(([label, val]) => {
      if (val) {
        doc.text(`${label} : ${val}`);
      }
    });

    doc.moveDown(1);

    // RÉSUMÉ 

    if (jeu.resume?.fr || jeu.resume?.en) {
      sectionTitle("Résumé");
      const clean = (str) =>
        str
          ?.replace(/[\r\n]+/g, " ")   
          .replace(/\s{2,}/g, " ")     
          .trim()
        || null;

      const resumeFR = clean(jeu.resume.fr);
      const resumeEN = clean(jeu.resume.en);

      if (resumeFR) {
        doc.fontSize(12).text(`${resumeFR}`, {
          align: "justify",
          width: 500,
        });
        doc.moveDown(0.5);
      }

      if (resumeEN) {
        doc.fontSize(12).text(`${resumeEN}`, {
          align: "justify",
          width: 500,
        });
        doc.moveDown(0.7);
      }
    }

    // NOTES 
    const notes = jeu.resume?.notes;
    if (notes) {
      sectionTitle("Notes");

      // Autres éditions
      if (notes.autresEditions) {
        subTitle("Autres éditions");
        doc.text(notes.autresEditions, {
          width: 500,
          align: "justify",
        });
      }

      // Étiquettes génériques
      if (Array.isArray(notes.etiquettesGeneriques) && notes.etiquettesGeneriques.length) {
        subTitle("Étiquettes génériques");
        doc.text(notes.etiquettesGeneriques.join(", "), {
          width: 500,
          align: "justify",
        });
      }

      // Genres / Thèmes (MobyGames)
      if (jeu.genres?.length) {
        subTitle("Genres / Thèmes (MobyGames)");
        jeu.genres.forEach((g) => {
          const type = g.type || "Genre";
          const valeur = g.valeur || "";
          doc.text(`• ${type} : ${valeur}`, { width: 500 });
        });
      }

      // Liens avec la culture québécoise
      if (notes.liensQuebec) {
        subTitle("Liens avec la culture québécoise");
        doc.text(notes.liensQuebec, {
          width: 500,
          align: "justify",
        });
      }

      // Récompenses
      if (jeu.recompenses?.length) {
        subTitle("Récompenses");
        jeu.recompenses.forEach((r) => {
          doc.text(`• ${r}`, { width: 500 });
        });
      }

      // Autres remarques
      if (jeu.autresRemarques) {
        subTitle("Autres remarques");
        doc.text(jeu.autresRemarques, {
          width: 500,
          align: "justify",
        });
      }

      if (jeu.ressourcesLudov?.length) {
        subTitle("Ressources LUDOV");
        jeu.ressourcesLudov.forEach((r) => {
          if (r.url) {
            doc.text(`• ${r.url}`, { width: 500 });
          }
        });
      }
    }

    const nettoyerTitreBD = (titre) => {
      if (!titre) return "";

      const prefixes = [
        "Critiques et/ou couverture médiatique",
        "Paratextes",
        "Autres sources pertinentes",
        "Documents de référence",
        "Références"
      ];

      for (const p of prefixes) {
        if (titre.startsWith(p)) {
          return titre
            .slice(p.length)
            .replace(/^[:\s]*/m, "")
            .trim();
        }
      }

      return titre.trim();
    };

    const renderList = (elements) => {
      if (!elements || !elements.length) return;
      elements.forEach((item) => {
        const t = nettoyerTitreBD(item.titre);
        const url = item.url || "";
        const ligne = url ? `• ${t} ${url}` : `• ${t}`;
        doc.text(ligne, { width: 500 });
      });
    };

    // SOURCES
    sectionTitle("Sources");

    // Documents de référence
    if (jeu.documentsReference?.length) {
      subTitle("Documents de référence");
      renderList(jeu.documentsReference);
    }

    // Critiques et/ou couverture médiatique
    if (jeu.critiques?.length) {
      subTitle("Critiques et/ou couverture médiatique");
      renderList(jeu.critiques);
    }

    // Paratextes
    if (jeu.paratextes?.length) {
      subTitle("Paratextes");
      renderList(jeu.paratextes);
    }

    // Autres sources pertinentes
    if (jeu.autresSources?.length) {
      subTitle("Autres sources pertinentes");
      renderList(jeu.autresSources);
    }

    // CRÉDITS 
    if (notes?.credits) {
      sectionTitle("Crédits");
      doc
        .fontSize(12)
        .text(notes.credits, {
          width: 500,
          align: "justify",
        });
    }

    //PIED DE PAGE 
    doc.moveDown(2);
    const footerHeight = 40;
    const yFooter = doc.page.height - footerHeight;

    doc.rect(0, yFooter, doc.page.width, footerHeight).fill("#2C3E50");
    doc
      .fillColor("white")
      .font("Helvetica")
      .fontSize(10)
      .text("Catalogue LUDOV - Jeux québécois", 50, yFooter + 12, {
        align: "center",
      });

    doc.end();

    stream.on("finish", () => {
      res.download(filePath, nomPdf, () => {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // ignore
        }
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
