const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const documentos = require("./routes/documentos");
const { loadConfig } = require("./config");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

loadConfig();

app.use("/v1/documentos_paciente", documentos);

module.exports = app;
