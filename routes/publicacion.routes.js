const express = require("express");
const router = express.Router();

const {
  getAllPublicaciones,
  postPublicacion,
} = require("../controllers/publicacion.controller");

router.get("/", getAllPublicaciones);

router.post("/", postPublicacion);

module.exports = router;
