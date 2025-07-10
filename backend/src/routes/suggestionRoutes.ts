const express = require("express");
const router = express.Router();
const { criarSugestao } = require("../controllers/sugestoesController");

router.post("/suggestions", criarSugestao);

module.exports = router;
