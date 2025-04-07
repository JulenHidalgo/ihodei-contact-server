const express = require("express");
const router = express.Router();

const { getAllPreview } = require("../controllers/preview.controller");

router.get("/", getAllPreview);

module.exports = router;
