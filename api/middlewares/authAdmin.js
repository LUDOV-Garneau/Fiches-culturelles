import jwt from "jsonwebtoken";

export function authAdmin(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token manquant ou invalide." });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé." });
    }

    req.admin = decoded; 
    next();
  } catch (err) {
    console.error("Erreur authAdmin:", err.message);
    res.status(401).json({ message: "Token invalide ou expiré." });
  }
}