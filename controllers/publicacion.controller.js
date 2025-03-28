const Publicacion = require("../models/publicacion.model");

const getAllPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.getAll();
    console.log("Obteniendo publicaciones:", publicaciones);
    return res.json(publicaciones);
  } catch (err) {
    console.error("Error obteniendo publicaciones:", err.message);
    return res.status(500).json({ error: "Error obteniendo publicaciones" });
  }
};

const postPublicacion = async (req, res) => {
  try {
    const { titulo, texto } = req.body;

    const publicacion = await Publicacion.postPublicacion(titulo, texto);
    console.log("Publicación creada:", publicacion);
    return res.status(201).json(publicacion);
  } catch (err) {
    console.error("Error creando publicacion:", err.message);
    return res.status(500).json({ error: "Error creando publicacion" });
  }
};

// Exportar los controladores
module.exports = {
  getAllPublicaciones,
  postPublicacion,
};
