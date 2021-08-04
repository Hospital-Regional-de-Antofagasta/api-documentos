const Documentos = require("../models/Documentos");
const { getMensajes } = require("../config");

exports.getDocumentos = async (req, res) => {
  try {
    const tipo = req.query.tipo;
    const filter = tipo
      ? { numeroPaciente: { $in: req.numerosPaciente }, tipo }
      : { numeroPaciente: { $in: req.numerosPaciente } };

    const cantidad = parseInt(req.query.cantidad);

    const documentos = await Documentos.find(filter)
      .sort({ fecha: -1 })
      .limit(cantidad)
      .exec();
    res.status(200).send(documentos);
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
