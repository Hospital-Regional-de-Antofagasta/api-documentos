const ConfigApiDocumentos = require("./models/ConfigApiDocumentos");

const mensajesPorDefecto = {
  forbiddenAccess: {
    titulo: "Alerta",
    mensaje: "Su sesión ha expirado.",
    color: "",
    icono: "",
  },
  serverError: {
    titulo: "Alerta",
    mensaje: "Ocurrió un error inesperado.",
    color: "",
    icono: "",
  },
  badRequest: {
    titulo: "Alerta",
    mensaje: "La solicitud no está bien formada.",
    color: "",
    icono: "",
  },
  solicitudCreada: {
    titulo: "!Todo ha salido bien¡",
    mensaje:
      "Su solicitud ha sido creada con éxito, pronto recibirá un correo con su documento.",
    color: "",
    icono: "",
  },
  solicitudDuplicada: {
    titulo: "Solicitud Pendiente",
    mensaje: "Ya tiene una solicitud en curso.",
    color: "",
    icono: "",
  },
};

exports.getMensajes = async (tipo) => {
  try {
    const { mensajes } = await ConfigApiDocumentos.findOne({
      version: 1,
    }).exec();
    if (mensajes) {
      return mensajes[tipo];
    }
    return mensajesPorDefecto[tipo];
  } catch (error) {
    return mensajesPorDefecto[tipo];
  }
};
