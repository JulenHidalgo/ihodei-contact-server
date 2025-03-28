const express = require("express");
const router = express.Router();

const {
  getAllPublicaciones,
} = require("../controllers/publicacion.controller");

router.get("/", getAllPublicaciones);

module.exports = router;
