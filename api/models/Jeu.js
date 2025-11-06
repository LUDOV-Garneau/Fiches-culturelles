import mongoose from "mongoose";

// Notes associées au résumé
const NotesResumeSchema = new mongoose.Schema(
  {
    credits: { type: String, default: null },
    autresEditions: { type: String, default: null },
    etiquettesGeneriques: { type: [String], default: undefined },
    liensQuebec: { type: String, default: null },
  },
  { _id: false }
);

// Résumé (FR, EN, brut)
const ResumeSchema = new mongoose.Schema(
  {
    brut: { type: String, required: true },
    fr: { type: String, default: null },
    en: { type: String, default: null },
    notes: { type: NotesResumeSchema, default: undefined },
  },
  { _id: false }
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
  { _id: false }
);

// Source du document
const SourceSchema = new mongoose.Schema(
  {
    systeme: { type: String, default: "koha" },
    idCadre: { type: String, default: null },
  },
  { _id: false }
);

// Infos d’ingestion
const IngestionSchema = new mongoose.Schema(
  {
    dateCreation: { type: Date, default: null },
    horodatage: { type: Date, default: null },
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
    titreComplet: { type: TitreSchema, required: true },
    plateformes: { type: [String], default: undefined }, 
    anneeSortie: { type: Number, default: null },
    developpeurs: { type: [String], default: undefined },
    editeurs: { type: [String], default: undefined },
    typeMedia: { type: String, default: null },
    urls: { type: [String], default: undefined },
    pages: { type: Number, default: null },
    imageUrl: { type: String, default: null },

    resume: { type: ResumeSchema, required: true },
    caracteristiques: { type: [String], default: undefined },
    estLieAuQuebec: { type: Boolean, default: false },

    identifiantsExternes: { type: IdentifiantsExternesSchema, default: undefined },
    source: { type: SourceSchema, default: undefined },
    ingestion: { type: IngestionSchema, default: undefined },

    original: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true, versionKey: false }
);

// Index texte basique
JeuSchema.index({
  titre: "text",
  "resume.fr": "text",
  "resume.en": "text",
  developpeurs: "text",
  editeurs: "text",
  caracteristiques: "text",
});

export default mongoose.model("Jeu", JeuSchema);
