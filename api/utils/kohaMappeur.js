import { franc } from "franc-min";

/**
 * Découpe un champ d'URLs Koha séparées par " | "
 */
function decouperUrls(champ) {
  if (!champ) return undefined;
  return String(champ)
    .split("|")
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Détection  la langue
 * @param {string} texte
 * @returns {"fr"|"en"|null}
 */
function detecterLangue(texte) {
  if (!texte || texte.trim().length < 5) return null;
  const code = franc(texte);
  if (code === "fra") return "fr";
  if (code === "eng") return "en";
  return null;
}

/**
 * Extrait FR/EN + notes + caractéristiques depuis l'abstract Koha
 */
function extraireDepuisAbstract(abstractBrut) {
  const brut = abstractBrut ? String(abstractBrut) : "";
  if (!brut) {
    return { resume: { brut: "" }, caracteristiques: [] };
  }

  const segments = brut.split("|").map(s => s.trim()).filter(Boolean);
  let fr = null, en = null;

  const notes = {
    credits: null,
    autresEditions: null,
    etiquettesGeneriques: null,
    liensQuebec: null,
  };

  const caracs = new Set();

  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    const lower = s.toLowerCase();

    // Bloc résumé FR
    if (i === 0) {
      fr = s;
      if (detecterLangue(s) === "en") en = s; 
    }

    // Bloc résumé EN
    else if (i === 1) {
      en = s;
      if (detecterLangue(s) === "fr") fr = s; 
    }

    // Blocs  notes
    else {
      if (lower.startsWith("crédits")) {
        notes.credits = s.replace(/^crédits\s*:\s*/i, "").trim() || null;
      } else if (lower.startsWith("autres éditions")) {
        notes.autresEditions = s.replace(/^autres éditions\s*:\s*/i, "").trim() || null;
      } else if (lower.startsWith("étiquettes génériques")) {
        const reste = s.replace(/^étiquettes génériques\s*:\s*/i, "").trim();
        notes.etiquettesGeneriques = reste
          ? reste.split(",").map(x => x.trim()).filter(Boolean)
          : null;
      } else if (lower.startsWith("liens avec la culture québécoise")) {
        notes.liensQuebec = s.replace(/^liens avec la culture québécoise\s*:\s*/i, "").trim() || null;
      }
    }

    // Caractéristiques 
    const motsCles = [
      "coop", "cooperative", "multiplayer", "customizable weapons",
      "cover", "parachute", "aggro", "warzone", "bounties", "extraction"
    ];
    for (const m of motsCles) if (lower.includes(m)) caracs.add(m);
    if (lower.includes("two man")) caracs.add("stratégies à deux");
    if (lower.includes("4 players") || lower.includes("four players")) caracs.add("4 joueurs");
  }

  return {
    resume: {
      brut,
      fr: fr || null,
      en: en || null,
      notes:
        (notes.credits || notes.autresEditions || notes.etiquettesGeneriques || notes.liensQuebec)
          ? notes
          : undefined,
    },
    caracteristiques: Array.from(caracs),
  };
}
/**
 * Mapping principal Koha - Jeu
 * @param {object} k  
 * @returns {object}
 */
function mapperKohaVersJeu(k) {
  const plateformes = k.edition_statement ? [String(k.edition_statement).trim()] : undefined;

  const annee =
    k.copyright_date ??
    k.publication_year ??
    null;

  const urls = decouperUrls(k.url);
  const pages = k.pages ? Number(String(k.pages).replace(/[^\d]/g, "")) : null;

  const devs = k.author
    ? String(k.author).split(/;|,/).map(s => s.trim()).filter(Boolean)
    : undefined;

  const eds = k.publisher
    ? String(k.publisher).split(/;|,/).map(s => s.trim()).filter(Boolean)
    : undefined;

  const { resume, caracteristiques } = extraireDepuisAbstract(k.abstract || "");

  const estLieAuQuebec =
  (devs && devs.some(d => /montr(e|é)al|qu(é|e)bec/i.test(d))) ||
  (resume?.notes?.liensQuebec && resume.notes.liensQuebec.length > 0) ||
  (k.publication_place &&
    /(montr(e|é)al|qu(é|e)bec|laval|sherbrooke|trois-rivi(è|e)res)/i.test(
      k.publication_place
    )) ||
  (k.framework_id && k.framework_id.toUpperCase() === "QCTE");

  return {
    // Principaux champs
    titre: String(k.title || "").trim(),
    plateformes,
    anneeSortie: annee ? Number(annee) : null,
    developpeurs: devs,
    editeurs: eds,
    typeMedia: k.item_type ?? null,
    urls,
    pages,

    // Résumé et caracs
    resume,
    caracteristiques: caracteristiques.length ? caracteristiques : undefined,
    estLieAuQuebec,

    // Métadonnées / Traçabilité
    identifiantsExternes: {
      kohaBiblioId: k.biblio_id != null ? Number(k.biblio_id) : undefined,
      ean: k.ean ?? null,
      isbn: k.isbn ?? null,
      issn: k.issn ?? null,
      lc: k.lc_control_number ?? null,
    },
    source: { systeme: "koha", idCadre: k.framework_id ?? null },
    ingestion: {
      dateCreation: k.creation_date ? new Date(k.creation_date) : null,
      horodatage: k.timestamp ? new Date(k.timestamp) : null,
    },

    original: k,
  };
}

export {
  decouperUrls,
  detecterLangue,
  extraireDepuisAbstract,
  mapperKohaVersJeu,
};