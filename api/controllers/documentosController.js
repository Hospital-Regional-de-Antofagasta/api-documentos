const Documentos = require("../models/Documentos");
const { getMensajes } = require("../config");

exports.getDocumentos = async (req, res) => {
  try {
    const tipo = req.query.tipo;
    const filter = tipo
      ? { rutPaciente: req.rut, tipo }
      : { rutPaciente: req.rut };

    const cantidad = parseInt(req.query.cantidad);

    if (cantidad) {
      const documentos = await Documentos.find(filter)
        .sort({ fecha: -1 })
        .limit(cantidad)
        .exec();
      return res.status(200).send(documentos);
    }
    const documentos = await Documentos.find(filter)
      .sort({ fecha: -1 })
      .exec();
    return res.status(200).send(documentos);
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
