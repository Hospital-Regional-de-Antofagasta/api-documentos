const supertest = require("supertest");
const app = require("../api/index");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Documentos = require("../api/models/Documentos");
const documentosSeed = require("../api/testSeeds/documentosSeed.json");
const { mensajes } = require("../api/config");

const request = supertest(app);

const secret = process.env.JWT_SECRET;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI_TEST}documentos_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Documentos.create(documentosSeed);
});

afterEach(async () => {
  await Documentos.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints documentos", () => {
  describe("Get documentos segun tipo", () => {
    it("Should not get documentos without token", async () => {
      const response = await request
        .get("/v1/documentos_paciente?tipo=dau")
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ respuesta: mensajes.forbiddenAccess });
    });
    it("Should not get documentos from non existing tipo", async () => {
      const token = jwt.sign({ numeroPaciente: 1 }, secret);
      const response = await request
        .get("/v1/documentos_paciente?tipo=dau")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
    it("Should not get documentos if there are not any", async () => {
      const token = jwt.sign({ numeroPaciente: 3 }, secret);
      const response = await request
        .get("/v1/documentos_paciente?tipo=DAU")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
    it("Should get documentos tipo DAU", async () => {
      const token = jwt.sign({ numeroPaciente: 1 }, secret);
      const response = await request
        .get("/v1/documentos_paciente?tipo=DAU")
        .set("Authorization", token);

      const documentosDauObtenidos = await Documentos.find({
        numeroPaciente: 1,
        tipo: "DAU",
      }).exec();

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(documentosDauObtenidos.length);
      expect(response.body[0].fecha < response.body[1].fecha).toBeTruthy();
      expect(response.body[1].fecha < response.body[2].fecha).toBeTruthy();
    });
    it("Should get documentos tipo EPICRISIS", async () => {
      const token = jwt.sign({ numeroPaciente: 1 }, secret);
      const response = await request
        .get("/v1/documentos_paciente?tipo=EPICRISIS")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });
  });
});
