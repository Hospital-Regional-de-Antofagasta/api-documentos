const express = require("express");
const solicitudesDocumentosController = require("../controllers/solicitudesDocumentosController");
const { isAuthenticated } = require("../middleware/auth");
const {
  validateBodySolicitud,
  validateDuplicatedSolicitud,
  validateDocumentExists,
} = require("../middleware/validations");

const router = express.Router();

router.post(
  "",
  isAuthenticated,
  validateBodySolicitud,
  validateDocumentExists,
  validateDuplicatedSolicitud,
  solicitudesDocumentosController.createSolicitudDocumento
);

router.get(
  "/existe/:idDocumento",
  isAuthenticated,
  validateDocumentExists,
  solicitudesDocumentosController.checkExistsSolicitudDocumento
);

router.get(
  "",
  isAuthenticated,
  solicitudesDocumentosController.getSolicitudesDocumentos
);

module.exports = router;
