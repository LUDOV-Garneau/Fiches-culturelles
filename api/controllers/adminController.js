import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

/**
 * Connexion d’un administrateur
 */
export async function loginAdmin(req, res) {
  try {
    const { nomUtilisateur, motDePasse } = req.body;

    if (!nomUtilisateur || !motDePasse) {
      return res.status(400).json({ message: "Champs requis manquants." });
    }

    const admin = await Admin.findOne({ nomUtilisateur });
    if (!admin) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const motDePasseValide = await admin.validerMotDePasse(motDePasse);
    if (!motDePasseValide) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      admin: admin.nomUtilisateur
    });
  } catch (err) {
    console.error("Erreur login admin:", err);
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
}
