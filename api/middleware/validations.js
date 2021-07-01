const Joi = require("joi");
const SolicitudesDocumentos = require("../models/SolicitudesDocumentos");
const { mensajes } = require("../config");

exports.validateBodySolicitud = async (req, res, next) => {
  try {
    const schema = Joi.object({
      correlativoDocumento: Joi.number().required(),
      tipoDocumento: Joi.string().required(),
    });

    const options = {
      stripUnknown: true,
    };

    const { error, value } = schema.validate(req.body, options);

    if (error)
      return res.status(400).send({
        respuesta: mensajes.badRequest,
        detalles_error: `Validation error: ${error.details
          .map((x) => x.message)
          .join(", ")}`,
      });
    req.body = value;
    next();
  } catch (error) {
    res.status(500).send({ respuesta: mensajes.serverError });
  }
};

exports.validateDuplicationSolicitud = async (req, res, next) => {
  try {
    const numeroPaciente = req.numeroPaciente;
    const { tipoDocumento, correlativoDocumento } = req.body;
    const filter = { numeroPaciente, tipoDocumento, correlativoDocumento };
    const solicitudExistente = await SolicitudesDocumentos.findOne(
      filter
    ).exec();
    if (solicitudExistente)
      return res.status(400).send({
        respuesta: mensajes.badRequest,
        detalles_error: "Solicitud duplicada",
      });
    next();
  } catch (error) {
    res.status(500).send({ respuesta: mensajes.serverError });
  }
};
