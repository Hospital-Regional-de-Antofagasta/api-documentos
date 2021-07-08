const Documentos = require("../models/Documentos");
const { mensajes } = require("../config");

exports.getDocumentos = async (req, res) => {
  try {
    const tipo = req.query.tipo;
    const filter = tipo
      ? { numeroPaciente: req.numeroPaciente, tipo }
      : { numeroPaciente: req.numeroPaciente };

    const cantidad = parseInt(req.query.cantidad);

    const documentos = await Documentos.find(filter)
      .sort({ fecha: -1 })
      .limit(cantidad)
      .exec();
    res.status(200).send(documentos);
  } catch (error) {
    res.status(500).send({ respuesta: mensajes.serverError });
  }
};
