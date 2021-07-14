const SolicitudesDocumentos = require("../models/SolicitudesDocumentos");
const { getMensajes } = require("../config");

exports.createSolicitudDocumento = async (req, res) => {
  try {
    const numeroPaciente = req.numeroPaciente;
    const solicitud = req.body;
    solicitud.numeroPaciente = numeroPaciente;
    await SolicitudesDocumentos.create(solicitud);
    res.status(201).send({ respuesta: await getMensajes("solicitudCreada") });
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};

exports.checkExistsSolicitudDocumento = async (req, res) => {
  try {
    const numeroPaciente = req.numeroPaciente;
    const { tipoDocumento, correlativoDocumento } = req.params;
    const filter = {
      numeroPaciente,
      tipoDocumento,
      correlativoDocumento,
      estado: { $ne: "REALIZADO" },
    };
    const solicitud = await SolicitudesDocumentos.findOne(filter).exec();
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
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
