const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SolicitudesDocumentos = mongoose.model(
  "solicitudes_documentos",
  new Schema(
    {
      correlativoSolicitud: {
        type: Number,
        default: 0,
      },
      anio: {
        type: Number,
        default: 0,
      },
      numeroPaciente: { type: Number, select: false },
      correlativoDocumento: String,
      tipoDocumento: String,
      estado: {
        // posibles estados: PENDIENTE, EN_PROCESO, REALIZADO
        type: String,
        default: "PENDIENTE",
      },
      codigoEstablecimiento: String,
    },
    { timestamps: true }
  ),
  "solicitudes_documentos"
);

module.exports = SolicitudesDocumentos;
