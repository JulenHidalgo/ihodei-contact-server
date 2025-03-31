const multer = require("multer");
const path = require("path");

// Usamos memoryStorage para acceder a file.buffer en el backend
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const validExtensions = [".mp4", ".mov", ".avi"];

  if (validExtensions.includes(ext)) {
    cb(null, true);
  } else {
    console.warn(`❌ Archivo rechazado por extensión no permitida: ${ext}`);
    cb(new Error("Solo se permiten vídeos (.mp4, .mov, .avi)"));
  }
};

// Middleware de subida configurado para extensiones de vídeo
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // Limite opcional: 100MB
  },
});

module.exports = upload;
