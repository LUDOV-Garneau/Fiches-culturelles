import mongoose from "mongoose";

// Notes associées au résumé
const NotesResumeSchema = new mongoose.Schema(
  {
    credits: { type: String, default: null },
    autresEditions: { type: String, default: null },
    etiquettesGeneriques: { type: [String], default: [] },
    liensQuebec: { type: String, default: null },
  },
  { _id: false },
);

// Résumé (FR, EN, brut)
const ResumeSchema = new mongoose.Schema(
  {
    brut: { type: String, required: true },
    fr: { type: String, default: null },
    en: { type: String, default: null },
    notes: { type: NotesResumeSchema, default: undefined },
  },
  { _id: false },
);

// Identifiants externes (Koha, ISBN, etc.)
const IdentifiantsExternesSchema = new mongoose.Schema(
  {
    kohaBiblioId: { type: Number, index: true, unique: true, sparse: true },
    ean: { type: String, default: null },
    isbn: { type: String, default: null },
    issn: { type: String, default: null },
    lc: { type: String, default: null },
  },
  { _id: false },
);

// Source du document
const SourceSchema = new mongoose.Schema(
  {
    systeme: { type: String, default: "koha" },
    idCadre: { type: String, default: null },
  },
  { _id: false },
);

// Infos d’ingestion
const IngestionSchema = new mongoose.Schema(
  {
    dateCreation: { type: Date, default: null },
    horodatage: { type: Date, default: null },
  },
  { _id: false },
);

// Genres, thèmes, gameplay 
const GenreSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    valeur: { type: String, required: true },
  },
  { _id: false }
);

// Contenu physique 
const ContenuPhysiqueSchema = new mongoose.Schema(
  {
    quantite: { type: Number, default: 1 },
    type: { type: String, required: true },
    materiaux: { type: String, default: null },
  },
  { _id: false }
);

// Métadonnées locales 
const LocalisationSchema = new mongoose.Schema(
  {
    coteLocal: { type: String, default: null },
    collection: { type: String, default: null },
    localisation: { type: String, default: null },
    sourceCatalogage: { type: String, default: null },
  },
  { _id: false }
);

// Titre complet 
const TitreSchema = new mongoose.Schema(
  {
    principal: { type: String, required: true },
    sousTitre: { type: String, default: null },
    alternatifs: { type: [String], default: [] },
  },
  { _id: false }
);

// Modèle principal Jeu
const JeuSchema = new mongoose.Schema(
  {
    // Informations de titre
    titreComplet: { type: TitreSchema, required: true },

    // Informations générales
    plateformes: { type: [String], default: [] },
    anneeSortie: { type: Number, default: null },
    developpeurs: { type: [String], default: [] },
    editeurs: { type: [String], default: [] },
    typeMedia: { type: String, default: null },
    urls: { type: [String], default: [] },
    pages: { type: Number, default: null },
    imageUrl: { type: String, default: null },

    // Provenance et contexte
    langue: { type: String, default: null },
    lieuPublication: { type: String, default: null },
    editeurPrincipal: { type: String, default: null },
    formatSupport: { type: String, default: null },

    // Description détaillée
    resume: { type: ResumeSchema, required: true },
    caracteristiques: { type: [String], default: [] },
    contenuPhysique: { type: [ContenuPhysiqueSchema], default: [] },
    genres: { type: [GenreSchema], default: [] },
    recompenses: { type: [String], default: [] },
    sources: { type: [String], default: [] },
    estLieAuQuebec: { type: Boolean, default: false },

    // Liens et identifiants
    identifiantsExternes: { type: IdentifiantsExternesSchema, default: undefined },
    source: { type: SourceSchema, default: undefined },
    ingestion: { type: IngestionSchema, default: undefined },
    localisation: { type: LocalisationSchema, default: undefined },

    // Données originales 
    original: { type: mongoose.Schema.Types.Mixed, required: true },
    autresRemarques: { type: String, default: null },

    ressourcesLudov: [
      {
        intitule: { type: String, default: null },
        url: { type: String, default: null },
      }
    ],

    documentsReference: [
      {
        titre: { type: String, default: null },
        url: { type: String, default: null },
      }
    ],

    critiques: [
      {
        titre: { type: String, default: null },
        url: { type: String, default: null },
      }
    ],

    paratextes: [
      {
        titre: { type: String, default: null },
        url: { type: String, default: null },
      }
    ],

    autresSources: [
      {
        titre: { type: String, default: null },
        url: { type: String, default: null },
      }
    ],


    estChoisi: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

// Index texte 
JeuSchema.index({
  "titreComplet.principal": "text",
  "titreComplet.sousTitre": "text",
  "titreComplet.alternatifs": "text",
  "resume.fr": "text",
  "resume.en": "text",
  developpeurs: "text",
  editeurs: "text",
  caracteristiques: "text",
  "genres.valeur": "text",
});

export default mongoose.model("Jeu", JeuSchema);
