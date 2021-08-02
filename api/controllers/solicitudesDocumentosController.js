const SolicitudesDocumentos = require("../models/SolicitudesDocumentos");
const Documentos = require("../models/Documentos");
const { getMensajes } = require("../config");

exports.createSolicitudDocumento = async (req, res) => {
  try {
    const documento = await Documentos.findById(req.body.idDocumento).select(
      "numeroPaciente.numero numeroPaciente.codigoEstablecimiento numeroPaciente.nombreEstablecimiento"
    );
    const solicitud = req.body;
    solicitud.numeroPaciente = documento.numeroPaciente;
    await SolicitudesDocumentos.create(solicitud);
    res.status(201).send({ respuesta: await getMensajes("solicitudCreada") });
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};

exports.checkExistsSolicitudDocumento = async (req, res) => {
  try {
    const documento = await Documentos.findById(req.params.idDocumento)
      .select(
        "numeroPaciente.numero numeroPaciente.codigoEstablecimiento numeroPaciente.nombreEstablecimiento tipo correlativo"
      )
      .exec();
    const filter = {
      numeroPaciente: documento.numeroPaciente,
      tipoDocumento: documento.tipo,
      correlativoDocumento: documento.correlativo,
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
    console.log(error);
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
