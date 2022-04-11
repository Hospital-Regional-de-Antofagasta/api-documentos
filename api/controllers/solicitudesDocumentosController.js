const SolicitudesDocumentos = require("../models/SolicitudesDocumentos");
const Documentos = require("../models/Documentos");
const { getMensajes } = require("../config");

exports.createSolicitudDocumento = async (req, res) => {
  try {
    const documento = req.documento;
    const { idDocumento, ...solicitud } = req.body;
    solicitud.rutPaciente = documento.rutPaciente;
    await SolicitudesDocumentos.create(solicitud);
    res.status(201).send({ respuesta: await getMensajes("solicitudCreada") });
  } catch (error) {
    if (process.env.NODE_ENV === "dev")
      return res.status(500).send({
        respuesta: await getMensajes("serverError"),
        detalles_error: {
          nombre: error.name,
          mensaje: error.message,
        },
      });
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};

exports.checkExistsSolicitudDocumento = async (req, res) => {
  try {
    const documento = req.documento;
    const solicitud = await SolicitudesDocumentos.findOne({
      rutPaciente: documento.rutPaciente,
      tipoDocumento: documento.tipo,
      identificadorDocumento: documento.identificadorDocumento,
      estado: { $ne: "REALIZADO" },
    }).exec();
    if (solicitud)
      return res.status(200).send({
        existeSolicitud: true,
        respuesta: await getMensajes("solicitudDuplicada"),
      });
    res.status(200).send({ existeSolicitud: false });
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};

exports.getSolicitudesDocumentos = async (req, res) => {
  try {
    const solicitudes = await SolicitudesDocumentos.find().exec();
    res.status(200).send(solicitudes);
  } catch (error) {
    if (process.env.NODE_ENV === "dev")
      return res.status(500).send({
        respuesta: await getMensajes("serverError"),
        detalles_error: {
          nombre: error.name,
          mensaje: error.message,
        },
      });
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
