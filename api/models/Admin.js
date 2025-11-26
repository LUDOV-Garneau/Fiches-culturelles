import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
  nomUtilisateur: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  courriel: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} n'est pas un courriel valide.`
    }
  },

  motDePasseHache: {
    type: String,
    required: true
  },
  creeLe: {
    type: Date,
    default: Date.now
  }
});

/**
 * Hache le mot de passe avant l’enregistrement
 */
adminSchema.pre("save", async function (next) {
  if (!this.isModified("motDePasseHache")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.motDePasseHache = await bcrypt.hash(this.motDePasseHache, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Vérifie le mot de passe lors de la connexion
 */
adminSchema.methods.validerMotDePasse = async function (motDePasse) {
  return await bcrypt.compare(motDePasse, this.motDePasseHache);
};

export default mongoose.model("Admin", adminSchema);
