const { object } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Documentos = mongoose.model(
  "documento",
  new Schema({
    numeroPaciente: {
      numero: {type: Number, require: true, select: false},
      codigoEstablecimiento: {type: String, require: true, select: false},
      hospital: {type: Object, select: false},
      nombreEstablecimiento: String,
    },
    fecha: Date,
    correlativo: String,
    tipo: String,
  }),
  "documentos"
);

module.exports = Documentos;
