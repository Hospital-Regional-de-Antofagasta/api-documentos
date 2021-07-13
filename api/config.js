const ConfigApiDocumentos = require("./models/ConfigApiDocumentos");

let mensajesPorDefecto = {
  forbiddenAccess: {
    titulo: "Alerta",
    mensaje: "Su sesión a expirado.",
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
    titulo: "Éxito",
    mensaje: "La solicitud fue creada con éxito.",
    color: "",
    icono: "",
  },
  solicitudDuplicada: {
    titulo: "Alerta",
    mensaje: "La solicitud ya existe.",
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
  } catch (error) {}
};
