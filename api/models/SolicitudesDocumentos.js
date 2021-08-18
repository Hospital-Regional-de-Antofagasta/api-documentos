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
      numeroPaciente: {
        numero: {type: Number, require: true, select: false},
        codigoEstablecimiento: {type: String, require: true, select: false},
        hospital: {type: Object, select: false},
        nombreEstablecimiento: String,
      },
      correlativoDocumento: String,
      tipoDocumento: String,
      estado: {
        // posibles estados: PENDIENTE, EN_PROCESO, REALIZADO
        type: String,
        default: "PENDIENTE",
      },
    },
    { timestamps: true }
  ),
  "solicitudes_documentos"
);

module.exports = SolicitudesDocumentos;
