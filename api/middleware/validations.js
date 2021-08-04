const Joi = require("joi");
const SolicitudesDocumentos = require("../models/SolicitudesDocumentos");
const { getMensajes } = require("../config");

exports.validateBodySolicitud = async (req, res, next) => {
  try {
    const schema = Joi.object({
      idDocumento: Joi.string().required(),
      correlativoDocumento: Joi.string().required(),
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
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};

exports.validateDuplicationSolicitud = async (req, res, next) => {
  try {
    const {tipoDocumento, correlativoDocumento } = req.body;
    const filter = { numeroPaciente:{ $in: req.numerosPaciente }, tipoDocumento, correlativoDocumento };
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
