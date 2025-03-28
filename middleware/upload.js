const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage(); // el archivo se guarda en memoria

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".mp4" || ext === ".mov" || ext === ".avi") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten vídeos (.mp4, .mov, .avi)"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
