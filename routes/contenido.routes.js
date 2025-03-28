const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  getContenidoByIdPublicacion,
  postContenido,
} = require("../controllers/contenido.controller");

router.get("/", getContenidoByIdPublicacion);

router.post("/", upload.single("video"), postContenido);

module.exports = router;
