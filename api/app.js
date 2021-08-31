require("dotenv").config();
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

if (require.main === module) { // true if file is executed
  process.on("SIGINT",function (){
    process.exit();
  });
  app.listen(port, () => {
    console.log(`App listening at http://${localhost}:${port}`)
  })
}

module.exports = app;
