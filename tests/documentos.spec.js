const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Documentos = require("../api/models/Documentos");
const documentosSeed = require("./testSeeds/documentosSeed.json");
const { getMensajes } = require("../api/config");
const ConfigApiDocumentos = require("../api/models/ConfigApiDocumentos");
const configSeed = require("./testSeeds/configSeed.json");

const request = supertest(app);

const secreto = process.env.JWT_SECRET;
let token;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI}/documentos_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Documentos.create(documentosSeed);
  await ConfigApiDocumentos.create(configSeed);
});

afterEach(async () => {
  await Documentos.deleteMany();
  await ConfigApiDocumentos.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints documentos", () => {
  describe("GET /v1/documentos-paciente?tipo&?cantidad", () => {
    it("Should not get documentos without token", async () => {
      const response = await request
        .get("/v1/documentos-paciente?tipo=dau")
        .set("Authorization", "no-token");

      const mensaje = await getMensajes("forbiddenAccess");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should not get documentos from non existing tipo", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          rut: "11111111-1",
        },
        secreto
      );
      const response = await request
        .get("/v1/documentos-paciente?tipo=dau")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
    it("Should not get documentos if there are not any", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          rut: "33333333-3",
        },
        secreto
      );
      const response = await request
        .get("/v1/documentos-paciente?tipo=DAU")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
    it("Should get documentos tipo DAU", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          rut: "11111111-1",
        },
        secreto
      );
      const response = await request
        .get("/v1/documentos-paciente?tipo=DAU")
        .set("Authorization", token);

      const documentosDauObtenidos = await Documentos.find({
        rutPaciente: "11111111-1",
        tipo: "DAU",
      }).exec();

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(documentosDauObtenidos.length);
      expect(response.body[0].fecha > response.body[1].fecha).toBeTruthy();
      expect(response.body[1].fecha > response.body[2].fecha).toBeTruthy();
      expect(response.body[2].fecha > response.body[3].fecha).toBeTruthy();
    });
    it("Should get documentos tipo EPICRISIS", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          rut: "11111111-1",
        },
        secreto
      );
      const response = await request
        .get("/v1/documentos-paciente?tipo=EPICRISIS")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });
    it("Should get only 5 documentos tipo DAU", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          rut: "11111111-1",
        },
        secreto
      );
      const response = await request
        .get("/v1/documentos-paciente?tipo=DAU&cantidad=5")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(5);
      expect(response.body[0].fecha > response.body[1].fecha).toBeTruthy();
      expect(response.body[1].fecha > response.body[2].fecha).toBeTruthy();
      expect(response.body[2].fecha > response.body[3].fecha).toBeTruthy();
      expect(response.body[3].fecha > response.body[4].fecha).toBeTruthy();
    });
  });
});
