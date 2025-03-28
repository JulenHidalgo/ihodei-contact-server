const Contenido = require("../models/contenido.model");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

// Autenticación con token y credenciales
const auth = new google.auth.OAuth2();
auth.setCredentials(require("../token.json"));
const drive = google.drive({ version: "v3", auth });

const postContenido = async (req, res) => {
  try {
    const { publicacion_id } = req.body;
    const file = req.file;

    if (!file)
      return res.status(400).json({ error: "No se envió ningún archivo" });
    if (!publicacion_id)
      return res.status(400).json({ error: "Falta publicacion_id" });

    const fileMetadata = {
      name: file.originalname,
      parents: ["1wMzpUZFE-CHArZAfyV7cbCjpU26SLnlS"],
    };

    const media = {
      mimeType: file.mimetype,
      body: Buffer.from(file.buffer),
    };

    // Subir a Google Drive
    const driveRes = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: file.mimetype,
        body:
          file.stream || require("streamifier").createReadStream(file.buffer),
      },
      fields: "id",
    });

    const fileId = driveRes.data.id;

    // Guardar en la base de datos
    const contenido = await Contenido.saveVideo(fileId, publicacion_id);

    res.status(201).json({
      mensaje: "Contenido guardado correctamente",
      contenido,
    });
  } catch (err) {
    console.error("Error en postContenido:", err.message);
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
