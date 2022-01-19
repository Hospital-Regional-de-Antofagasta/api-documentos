const Joi = require("joi");
const SolicitudesDocumentos = require("../models/SolicitudesDocumentos");
const Documentos = require("../models/Documentos");
const { getMensajes } = require("../config");

exports.validateBodySolicitud = async (req, res, next) => {
  try {
    const schema = Joi.object({
      idDocumento: Joi.string().required(),
      codigoEstablecimiento: Joi.string().required(),
      identificadorDocumento: Joi.string().required(),
      tipoDocumento: Joi.string().required(),
    });

    const options = {
      stripUnknown: true,
    };

    const { error, value } = schema.validate(req.body, options);

    if (error)
      return res
        .status(400)
        .send({ respuesta: await getMensajes("badRequest") });
    req.body = value;
    next();
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

exports.validateDuplicatedSolicitud = async (req, res, next) => {
  try {
    const { tipoDocumento, identificadorDocumento, codigoEstablecimiento } =
      req.body;
    const rutPaciente = req.rut;
    const filter = {
      rutPaciente,
      codigoEstablecimiento,
      tipoDocumento,
      identificadorDocumento,
    };
    const solicitudExistente = await SolicitudesDocumentos.findOne(
      filter
    ).exec();
    if (solicitudExistente)
      return res
        .status(400)
        .send({ respuesta: await getMensajes("badRequest") });
    next();
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};

exports.validateDocumentExists = async (req, res, next) => {
  try {
    let idDocumento = req.body.idDocumento;
    if (!idDocumento) idDocumento = req.params.idDocumento;
    const documento = await Documentos.findById(idDocumento).select(
      "rutPaciente tipo identificadorDocumento"
    );
    if (!documento)
      return res
        .status(400)
        .send({ respuesta: await getMensajes("badRequest") });
    req.documento = documento;
    next();
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
