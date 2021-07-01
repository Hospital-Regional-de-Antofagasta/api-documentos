const express = require("express");
const solicitudesDocumentosController = require("../controllers/solicitudesDocumentosController");
const { isAuthenticated } = require("../middleware/auth");
const {
  validateBodySolicitud,
  validateDuplicationSolicitud,
} = require("../middleware/validations");

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  validateBodySolicitud,
  validateDuplicationSolicitud,
  solicitudesDocumentosController.createSolicitudDocumento
);

router.get(
  "/:tipoDocumento/:correlativoDocumento",
  isAuthenticated,
  solicitudesDocumentosController.checkExistsSolicitudDocumento
);

router.get(
  "/",
  isAuthenticated,
  solicitudesDocumentosController.getSolicitudesDocumentos
);

module.exports = router;
