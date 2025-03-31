const Contenido = require("../models/contenido.model");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const streamifier = require("streamifier");

// Autenticación con token y credenciales
const auth = new google.auth.OAuth2();
auth.setCredentials(JSON.parse(process.env.GOOGLE_TOKEN));
const drive = google.drive({ version: "v3", auth });

const postContenido = async (req, res) => {
  try {
    const { publicacion_id } = req.body;
    const file = req.file;

    if (!file) {
      console.log("❌ Archivo no recibido.");
      return res.status(400).json({ error: "No se envió ningún archivo" });
    }
    if (!publicacion_id) {
      console.log("❌ publicacion_id no recibido.");
      return res.status(400).json({ error: "Falta publicacion_id" });
    }

    console.log("✅ Archivo recibido:", {
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
    });

    const fileMetadata = {
      name: file.originalname,
      parents: ["1wMzpUZFE-CHArZAfyV7cbCjpU26SLnlS"], // Carpeta destino en Drive
    };

    const media = {
      mimeType: file.mimetype,
      body: streamifier.createReadStream(file.buffer),
    };

    const driveRes = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id",
    });

    const fileId = driveRes.data.id;
    console.log("📁 Archivo subido a Drive con ID:", fileId);

    const contenido = await Contenido.saveVideo(fileId, publicacion_id);

    res.status(201).json({
      mensaje: "Contenido guardado correctamente",
      contenido,
    });
  } catch (err) {
    console.error("❌ Error en postContenido:", err);
    res.status(500).json({ error: "Error al subir y guardar contenido" });
  }
};

const getContenidoByIdPublicacion = async (req, res) => {
  try {
    const { publicacion_id } = req.params;

    const contenidos = await Contenido.getAllFromPublicacion(publicacion_id);

    if (!contenidos || contenidos.length === 0) {
      console.log("No se encontraron contenidos para esta publicacion");
      return res
        .status(404)
        .json({ error: "No se encontraron contenidos para esta publicacion" });
    }

    console.log("Obteniendo contenido de publicacion:", contenidos);
    return res.status(200).json(contenidos);
  } catch (err) {
    console.error("Error obteniendo contenido de publicacion:", err.message);
    return res
      .status(500)
      .json({ error: "Error obteniendo contenido de publicacion" });
  }
};

// Exportar los controladores
module.exports = {
  getContenidoByIdPublicacion,
  postContenido,
};
