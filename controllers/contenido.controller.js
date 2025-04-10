const Contenido = require("../models/contenido.model");
const Preview = require("../models/preview.model");
const Publicacion = require("../models/publicacion.model");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const streamifier = require("streamifier");

// 1. Cargar credenciales del cliente (client_id, secret, etc.)
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const token = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../token.json"), "utf8")
);

const { client_id, client_secret, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// 2. Aplicar token guardado
oAuth2Client.setCredentials(token);

// 3. Guardar automáticamente si cambia
oAuth2Client.on("tokens", (tokens) => {
  if (tokens.refresh_token) {
    token.refresh_token = tokens.refresh_token;
  }
  token.access_token = tokens.access_token;
  token.expiry_date = tokens.expiry_date;

  fs.writeFileSync(
    path.join(__dirname, "../token.json"),
    JSON.stringify(token)
  );
});

const drive = google.drive({ version: "v3", auth: oAuth2Client });

let publicacion_id = "";

const postContenido = async (req, res) => {
  try {
    const { publicacion_id, tipoContenido } = req.body;
    const archivo = req.file;

    publicacion_id = publicacion_id;

    // Validaciones
    if (!archivo || !publicacion_id || !tipoContenido) {
      return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    const tiposValidos = ["PDF", "IMG", "VID"];
    if (!tiposValidos.includes(tipoContenido)) {
      return res.status(400).json({ error: "Tipo de contenido no válido" });
    }

    console.log("📦 Subiendo archivo a Google Drive...");

    let parent = "1wMzpUZFE-CHArZAfyV7cbCjpU26SLnlS";

    if (tipoContenido === "IMG") {
      parent = "1IEi2wP9Bt6ysFAM1dyycgxWsUukpzHOz";
    } else if (tipoContenido === "PDF") {
      parent = "1SCZ783qQkwlb2u4WkMHUbquGlEz3RnV9";
    } else if (tipoContenido === "VID") {
      parent = "1V4Lec5HisZAyUErCfDh8TvXugvIDV-eP";
    }

    const response = await drive.files.create({
      requestBody: {
        name: archivo.originalname,
        mimeType: archivo.mimetype,
        parents: [parent],
      },
      media: {
        mimeType: archivo.mimetype,
        body: streamifier.createReadStream(archivo.buffer),
      },
    });

    const fileId = response.data.id;

    console.log("✅ Archivo subido a Drive con ID:", fileId);

    // Guardar en base de datos
    const nuevoContenido = new Contenido(fileId, tipoContenido, publicacion_id);

    const resultado = await Contenido.saveInfo(nuevoContenido);

    res.status(200).json({
      mensaje: "Contenido guardado correctamente",
      contenido: resultado,
    });
  } catch (err) {
    if (await Preview.getByIdForDelete(publicacion_id)) {
      await Publicacion.deletePublicacion(publicacion_id);
    }
    console.error("❌ Error al subir contenido:", err.message);
    res.status(500).json({
      error:
        "El token ha caducado o no existe, por favor contacta con el responsable",
    });
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
