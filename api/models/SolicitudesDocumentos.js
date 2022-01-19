const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SolicitudesDocumentos = mongoose.model(
  "solicitudes_documentos",
  new Schema(
    {
      codigoEstablecimiento: { type: String, require: true },
      rutPaciente: { type: String, require: true, select: false },
      identificadorDocumento: { type: String, require: true },
      tipoDocumento: { type: String, require: true },
      correlativoSolicitud: {
        type: Number,
        default: 0,
      },
      anio: {
        type: Number,
        default: 0,
      },
      estado: { // Posibles estados: PENDIENTE, EN_PROCESO
        type: String,
        default: "PENDIENTE",
      },
    },
    { timestamps: true }
  ),
  "solicitudes_documentos"
);

module.exports = SolicitudesDocumentos;
