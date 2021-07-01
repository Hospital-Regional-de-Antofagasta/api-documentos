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
      numeroPaciente: Number,
      correlativoDocumento: Number,
      tipoDocumento: String,
      respondida: {
        type: Boolean,
        default: false,
      },
      enviadaHospital: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  ),
  "solicitudes_documentos"
);

module.exports = SolicitudesDocumentos;
