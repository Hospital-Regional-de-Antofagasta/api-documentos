const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfigApiDocumentos = mongoose.model(
  "config_api_documento",
  new Schema({
    mensajes: {
      forbiddenAccess: String,
      serverError: String,
      badRequest: String,
      version: Number,
    },
  }),
  "config_api_documentos"
);

module.exports = ConfigApiDocumentos;