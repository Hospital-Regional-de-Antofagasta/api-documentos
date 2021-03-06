const express = require("express");
const documentosController = require("../controllers/documentosController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get("", isAuthenticated, documentosController.getDocumentos);

module.exports = router;
