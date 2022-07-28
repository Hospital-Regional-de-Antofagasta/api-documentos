const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfigApiDocumentos = mongoose.model(
  "config_api_documentos",
  new Schema(
    {
      mensajes: {
        forbiddenAccess: {
          titulo: String,
          mensaje: String,
          color: String,
          icono: String,
        },
        serverError: {
          titulo: String,
          mensaje: String,
          color: String,
          icono: String,
        },
        badRequest: {
          titulo: String,
          mensaje: String,
          color: String,
          icono: String,
        },
        solicitudCreada: {
          titulo: String,
          mensaje: String,
          color: String,
          icono: String,
        },
        solicitudDuplicada: {
          titulo: String,
          mensaje: String,
          color: String,
          icono: String,
        },
      },
      version: Number,
    },
    { timestamps: true }
  ),
  "config_api_documentos"
);

module.exports = ConfigApiDocumentos;
