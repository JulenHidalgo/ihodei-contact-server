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

// Exportar los controladores
module.exports = {
  getAllPublicaciones,
};
