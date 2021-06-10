const ConfigApiDocumentos = require('./models/ConfigApiDocumentos')

let mensajes = {
  forbiddenAccess: "Su sesión a expirado.",
  serverError: "Se produjo un error.",
  badRequest: "La petición no está bien formada.",
}

const loadConfig = async () => {
  try {
    const config = await ConfigApiDocumentos.findOne({ version: 1 }).exec();
    mensajes = config.mensajes;
  } catch (error) {}
};

module.exports = {
  loadConfig,
  mensajes,
};