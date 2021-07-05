const SolicitudesDocumentos = require("../models/SolicitudesDocumentos");
const { mensajes } = require("../config");

exports.createSolicitudDocumento = async (req, res) => {
  try {
    const numeroPaciente = req.numeroPaciente;
    const solicitud = req.body;
    solicitud.numeroPaciente = numeroPaciente;
    await SolicitudesDocumentos.create(solicitud);
    res.status(201).send({});
  } catch (error) {
    res.status(500).send({ respuesta: mensajes.serverError });
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
    if (solicitud) return res.status(200).send({ respuesta: true });
    res.status(200).send({ respuesta: false });
  } catch (error) {
    console.log(error.name)
    console.log(error.message)
    res.status(500).send({ respuesta: mensajes.serverError });
  }
};

exports.getSolicitudesDocumentos = async (req, res) => {
  try {
    const solicitudes = await SolicitudesDocumentos.find().exec();
    res.status(200).send(solicitudes);
  } catch (error) {
    res.status(500).send({ respuesta: mensajes.serverError });
  }
};
