const { object } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Documentos = mongoose.model(
  "documento",
  new Schema({
    correlativo: { type: Number, require: true },
    identificadorDocumento: { type: String, require: true },
    rutPaciente: { type: String, require: true, select: false },
    tipo: { type: String, require: true },
    fecha: { type: Date, require: true },
    codigoEstablecimiento: { type: String, require: true },
    nombreEstablecimiento: { type: String, require: true },
  }),
  "documentos"
);

module.exports = Documentos;
