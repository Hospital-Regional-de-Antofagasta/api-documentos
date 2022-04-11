const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SolicitudesDocumentos = mongoose.model(
  "solicitudes_documentos",
  new Schema(
    {
      codigoEstablecimiento: { type: String, required: true },
      rutPaciente: { type: String, required: true, select: false },
      identificadorDocumento: { type: String, required: true },
      tipoDocumento: { type: String, required: true },
      correlativoSolicitud: {
        type: Number,
        default: 0,
      },
      anio: {
        type: Number,
        default: 0,
      },
      estado: {
        // Posibles estados: PENDIENTE, EN_PROCESO
        type: String,
        default: "PENDIENTE",
      },
    },
    { timestamps: true }
  ),
  "solicitudes_documentos"
);

module.exports = SolicitudesDocumentos;
