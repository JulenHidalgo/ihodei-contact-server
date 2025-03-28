const express = require("express");
const router = express.Router();

const {
  getAllFromPublicacion,
} = require("../controllers/contenido.controller");

router.get("/", getAllFromPublicacion);

module.exports = router;
