require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const documentos = require("./routes/documentos");
const solicitudesDocumentos = require("./routes/solicitudesDocumentos");

const app = express();
app.use(express.json());
app.use(cors());

const connection = process.env.MONGO_URI
const port = process.env.PORT
const localhost = process.env.HOSTNAME

mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/v1/documentos-paciente/health", (req, res) => {
  res.status(200).send("ready");
});

app.use("/v1/documentos-paciente", documentos);

app.use("/v1/documentos-paciente/solicitudes", solicitudesDocumentos);

if (require.main === module) { // true if file is executed
  process.on("SIGINT",function (){
    process.exit();
  });
  app.listen(port, () => {
    console.log(`App listening at http://${localhost}:${port}`)
  })
}

module.exports = app;
