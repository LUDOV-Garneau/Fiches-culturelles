import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const _upload = path.join(process.cwd(), "uploads");
if (!fs.existsSync(_upload)) fs.mkdirSync(_upload);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, _upload);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage, fileFilter });


router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Aucun fichier fourni.",
    });
  }

  const fileUrl = `http://72.11.148.122/uploads/${req.file.filename}`;

  
  return res.json({
    success: true,
    message: "Image téléversée avec succès.",
    imageUrl: fileUrl,
  });
});

export default router;
