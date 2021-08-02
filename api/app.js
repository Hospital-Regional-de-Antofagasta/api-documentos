const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const documentos = require("./routes/documentos");
const solicitudesDocumentos = require("./routes/solicitudesDocumentos");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/v1/documentos-paciente", documentos);

app.use("/v1/documentos-paciente/solicitudes", solicitudesDocumentos);

module.exports = app;