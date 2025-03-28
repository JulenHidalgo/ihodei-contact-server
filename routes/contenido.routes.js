const express = require("express");
const router = express.Router();

const {
  getContenidoByIdPublicacion,
} = require("../controllers/contenido.controller");

router.get("/", getContenidoByIdPublicacion);

module.exports = router;
