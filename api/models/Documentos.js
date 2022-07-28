const { object } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Documentos = mongoose.model(
  "documento",
  new Schema(
    {
      correlativo: { type: Number, required: true },
      identificadorDocumento: { type: String, required: true },
      rutPaciente: { type: String, required: true, select: false },
      tipo: { type: String, required: true },
      fecha: { type: Date, required: true },
      codigoEstablecimiento: { type: String, required: true },
      nombreEstablecimiento: { type: String, required: true },
    },
    { timestamps: true }
  ),
  "documentos"
);

module.exports = Documentos;
