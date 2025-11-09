import { franc } from "franc-min";
import axios from "axios";

async function obtenirImage(nomJeu) {
  try {
    //setup de l'api igdb
    const client_id = process.env.TWITCH_CLIENT_ID;
    const client_secret = process.env.TWITCH_CLIENT_SECRET;
    const TWITCH_API_URL = `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`;

    const twitchResponse = await axios.post(TWITCH_API_URL);

    const twitchToken = twitchResponse.data.access_token;

    const igdbResponse = await axios.post(
      "https://api.igdb.com/v4/games",
      `search "${nomJeu}";
       fields name, cover.url;
       limit 1;`,
      {
        headers: {
          "Client-ID": client_id,
          Authorization: `Bearer ${twitchToken}`,
          Accept: "application/json",
        },
      },
    );

    return (
      "https://" +
      igdbResponse.data[0].cover.url
        .slice(2)
        .replace("t_thumb", "t_1080p")
    );
  } catch (err) {
    console.error("Erreur IGDB:", err.response?.data || err.message);
    return null;
  }
}

/**
 * Découpe un champ d'URLs Koha séparées par " | "
 */
function decouperUrls(champ) {
  if (!champ) return undefined;
  return String(champ)
    .split("|")
    .map((s) => s.trim())
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

  const segments = brut
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  let fr = null,
    en = null;

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
        notes.autresEditions =
          s.replace(/^autres éditions\s*:\s*/i, "").trim() || null;
      } else if (lower.startsWith("étiquettes génériques")) {
        const reste = s.replace(/^étiquettes génériques\s*:\s*/i, "").trim();
        notes.etiquettesGeneriques = reste
          ? reste
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean)
          : null;
      } else if (lower.startsWith("liens avec la culture québécoise")) {
        notes.liensQuebec =
          s.replace(/^liens avec la culture québécoise\s*:\s*/i, "").trim() ||
          null;
      }
    }

    // Caractéristiques
    const motsCles = [
      "coop",
      "cooperative",
      "multiplayer",
      "customizable weapons",
      "cover",
      "parachute",
      "aggro",
      "warzone",
      "bounties",
      "extraction",
    ];
    for (const m of motsCles) if (lower.includes(m)) caracs.add(m);
    if (lower.includes("two man")) caracs.add("stratégies à deux");
    if (lower.includes("4 players") || lower.includes("four players"))
      caracs.add("4 joueurs");
  }

  return {
    resume: {
      brut,
      fr: fr || null,
      en: en || null,
      notes:
        notes.credits ||
        notes.autresEditions ||
        notes.etiquettesGeneriques ||
        notes.liensQuebec
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
  const plateformes = k.edition_statement ? [String(k.edition_statement).trim()] : [];
  const annee = k.copyright_date ?? k.publication_year ?? null;
  const urls = decouperUrls(k.url);
  const pages = k.pages ? Number(String(k.pages).replace(/[^\d]/g, "")) : null;

  const devs = k.author
    ? String(k.author).split(/;|,/).map((s) => s.trim()).filter(Boolean)
    : [];
  const eds = k.publisher
    ? String(k.publisher).split(/;|,/).map((s) => s.trim()).filter(Boolean)
    : [];

  const { resume, caracteristiques } = extraireDepuisAbstract(k.abstract || "");

  const estLieAuQuebec =
    (devs && devs.some((d) => /montr(e|é)al|qu(é|e)bec/i.test(d))) ||
    (resume?.notes?.liensQuebec && resume.notes.liensQuebec.length > 0) ||
    (k.publication_place &&
      /(montr(e|é)al|qu(é|e)bec|laval|sherbrooke|trois-rivi(è|e)res)/i.test(
        k.publication_place,
      )) ||
    (k.framework_id && k.framework_id.toUpperCase() === "QCTE");

  return {
    titreComplet: {
      principal: String(k.title || "").trim(),
      sousTitre: null,
      alternatifs: [],
    },
    plateformes,
    anneeSortie: annee ? Number(annee) : null,
    developpeurs: devs,
    editeurs: eds,
    typeMedia: k.item_type ?? null,
    urls,
    pages,
    resume,
    caracteristiques,
    estLieAuQuebec,
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

/* Extraction depuis MARC */
async function extraireDepuisMarc(id) {
  try {
    const url = `https://ludov.inlibro.net/cgi-bin/koha/opac-export.pl?op=export&bib=${id}&format=marcxml`;
    const { data } = await axios.get(url);
    const parser = new XMLParser({ ignoreAttributes: false });
    const marc = parser.parse(data);

    if (!marc?.record?.datafield) {
      console.warn(`Notice MARC vide pour ID ${id}`);
      return null;
    }

    const champs = marc.record.datafield;
    const get = (tag) => champs.filter((c) => c["@_tag"] === tag);
    const toArray = (sf) => (Array.isArray(sf) ? sf : sf ? [sf] : []);
    const decode = (txt) => {
      try {
        if (!txt) return null;
        if (typeof txt === "object") {
          if (txt["#text"]) txt = txt["#text"];
          else return null;
        }
        if (Array.isArray(txt)) txt = txt[0];
        return he.decode(String(txt).trim());
      } catch {
        return null;
      }
    };

    /*Titre, sous-titre, variantes */
    const champ245 = get("245")[0];
    const titrePrincipal = champ245
      ? decode(toArray(champ245.subfield).find((sf) => sf["@_code"] === "a")?.["#text"])
      : null;
    const sousTitre = champ245
      ? decode(toArray(champ245.subfield).find((sf) => sf["@_code"] === "b")?.["#text"])
      : null;

    const titresAlternatifs = get("246").map((c) =>
      decode(toArray(c.subfield).find((sf) => sf["@_code"] === "a")?.["#text"]),
    ).filter(Boolean);

    /*Développeur / Éditeur */
    const developpeur = get("100")[0]
      ? decode(toArray(get("100")[0].subfield).find((sf) => sf["@_code"] === "a")?.["#text"])
      : null;

    const editeurPrincipal = get("264")[0]
      ? decode(toArray(get("264")[0].subfield).find((sf) => sf["@_code"] === "b")?.["#text"])
      : null;

    const lieuPublication = get("264")[0]
      ? decode(toArray(get("264")[0].subfield).find((sf) => sf["@_code"] === "a")?.["#text"])
      : null;

    const annee = get("264")[0]
      ? decode(toArray(get("264")[0].subfield).find((sf) => sf["@_code"] === "c")?.["#text"])
      : null;

    const plateforme = get("250")[0]
      ? decode(toArray(get("250")[0].subfield).find((sf) => sf["@_code"] === "a")?.["#text"])
      : null;

    const urls = get("856")
      .map((f) => decode(toArray(f.subfield).find((sf) => sf["@_code"] === "u")?.["#text"]))
      .filter(Boolean);

    
   
    return {
      titreComplet: {
        principal: titrePrincipal,
        sousTitre,
        alternatifs: titresAlternatifs,
      },
      developpeur,
      editeurPrincipal,
      lieuPublication,
      annee: annee ? Number(annee) : null,
      plateforme,
      langue,
      resume: {
        brut: [resumeFR, resumeEN].filter(Boolean).join(" | "),
        fr: resumeFR,
        en: resumeEN,
        notes,
      },
      contenuPhysique: contenusPhysiques,
      recompenses,
      sources,
      genres,
      urls,
    };
  } catch (err) {
    console.error(`Erreur MARC ID ${id}:`, err.message);
    return null;
  }
}


export {
  decouperUrls,
  detecterLangue,
  extraireDepuisAbstract,
  obtenirImage,
  mapperKohaVersJeu,
  extraireDepuisMarc
};
