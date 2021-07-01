const supertest = require("supertest");
const app = require("../api/index");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const SolicitudesDocumentos = require("../api/models/SolicitudesDocumentos");
const solicitudesDocumentosSeed = require("../api/testSeeds/solicitudesDocumentos.json");
const { mensajes } = require("../api/config");

const request = supertest(app);

const secret = process.env.JWT_SECRET;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI_TEST}documentos_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await SolicitudesDocumentos.create(solicitudesDocumentosSeed);
});

afterEach(async () => {
  await SolicitudesDocumentos.deleteMany();
  await mongoose.disconnect();
});

const existingSolicitudDocumento = {
  correlativoDocumento: 2,
  tipoDocumento: "DAU",
};

const newSolicitudDocumento = {
  correlativoDocumento: 3,
  tipoDocumento: "DAU",
};

describe("Endpoints solicitudes documentos", () => {
  describe("Create solicitud documento", () => {
    it("Should not create solicitud documento without token", async () => {
      const response = await request
        .post(`/v1/documentos_paciente/solicitudes/`)
        .set("Authorization", "no-token")
        .send(newSolicitudDocumento);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ respuesta: mensajes.forbiddenAccess });
    });
    describe("Validate body", () => {
      it("Should not create solicitud documento wrong tipoDocumento", async () => {
        const token = jwt.sign({ numeroPaciente: 1 }, secret);
        const badSolicitudDocumento = {
          correlativoDocumento: 11,
          tipoDocumento: 1,
        };
        const response = await request
          .post(`/v1/documentos_paciente/solicitudes/`)
          .set("Authorization", token)
          .send(badSolicitudDocumento);

        expect(response.status).toBe(400);
        expect(response.body.respuesta).toEqual(mensajes.badRequest);
      });
      it("Should not create solicitud documento wrong correlativoDocumento", async () => {
        const token = jwt.sign({ numeroPaciente: 1 }, secret);
        const badSolicitudDocumento = {
          correlativoDocumento: "hola",
          tipoDocumento: "DAU",
        };
        const response = await request
          .post(`/v1/documentos_paciente/solicitudes/`)
          .set("Authorization", token)
          .send(badSolicitudDocumento);

        expect(response.status).toBe(400);
        expect(response.body.respuesta).toEqual(mensajes.badRequest);
      });
      it("Should not create solicitud documento without tipoDocumento", async () => {
        const token = jwt.sign({ numeroPaciente: 1 }, secret);
        const badSolicitudDocumento = {
          correlativoDocumento: 11,
        };
        const response = await request
          .post(`/v1/documentos_paciente/solicitudes/`)
          .set("Authorization", token)
          .send(badSolicitudDocumento);

        expect(response.status).toBe(400);
        expect(response.body.respuesta).toEqual(mensajes.badRequest);
      });
      it("Should not create solicitud documento without correlativoDocumento", async () => {
        const token = jwt.sign({ numeroPaciente: 1 }, secret);
        const badSolicitudDocumento = {
          tipoDocumento: "DAU",
        };
        const response = await request
          .post(`/v1/documentos_paciente/solicitudes/`)
          .set("Authorization", token)
          .send(badSolicitudDocumento);

        expect(response.status).toBe(400);
        expect(response.body.respuesta).toEqual(mensajes.badRequest);
      });
      it("Should not create solicitud documento without fields", async () => {
        const token = jwt.sign({ numeroPaciente: 1 }, secret);
        const badSolicitudDocumento = {};
        const response = await request
          .post(`/v1/documentos_paciente/solicitudes/`)
          .set("Authorization", token)
          .send(badSolicitudDocumento);

        expect(response.status).toBe(400);
        expect(response.body.respuesta).toEqual(mensajes.badRequest);
      });
    });
    it("Should not create solicitud documento if there is an equal solicitud pending", async () => {
      const token = jwt.sign({ numeroPaciente: 1 }, secret);
      const response = await request
        .post(`/v1/documentos_paciente/solicitudes/`)
        .set("Authorization", token)
        .send(existingSolicitudDocumento);

      expect(response.status).toBe(400);
      expect(response.body.respuesta).toEqual(mensajes.badRequest);
    });
    it("Should create solicitud documento", async () => {
      const token = jwt.sign({ numeroPaciente: 1 }, secret);
      const response = await request
        .post(`/v1/documentos_paciente/solicitudes/`)
        .set("Authorization", token)
        .send(newSolicitudDocumento);

      const filter = {
        numeroPaciente: 1,
        tipoDocumento: newSolicitudDocumento.tipoDocumento,
        correlativoDocumento: newSolicitudDocumento.correlativoDocumento,
      };
      const solicitudCreada = await SolicitudesDocumentos.findOne(
        filter
      ).exec();

      expect(response.status).toBe(201);
      expect(response.body).toEqual({});

      expect(solicitudCreada.numeroPaciente).toBe(1);
      expect(solicitudCreada.correlativoDocumento).toBe(
        newSolicitudDocumento.correlativoDocumento
      );
      expect(solicitudCreada.tipoDocumento).toBe(
        newSolicitudDocumento.tipoDocumento
      );
    });
  });
  describe("Check if solicitud documento exists for paciente and tipo documento", () => {
    it("Should not check without token", async () => {
      const response = await request
        .get(
          `/v1/documentos_paciente/solicitudes/${newSolicitudDocumento.tipoDocumento}/${newSolicitudDocumento.correlativoDocumento}`
        )
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ respuesta: mensajes.forbiddenAccess });
    });
    it("Should check on empty database", async () => {
      await SolicitudesDocumentos.deleteMany();
      const token = jwt.sign({ numeroPaciente: 1 }, secret);
      const response = await request
        .get(
          `/v1/documentos_paciente/solicitudes/${newSolicitudDocumento.tipoDocumento}/${newSolicitudDocumento.correlativoDocumento}`
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ respuesta: false });
    });
    it("Should check with non existing solicitud", async () => {
      const token = jwt.sign({ numeroPaciente: 1 }, secret);
      const response = await request
        .get(
          `/v1/documentos_paciente/solicitudes/${newSolicitudDocumento.tipoDocumento}/${newSolicitudDocumento.correlativoDocumento}`
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ respuesta: false });
    });
    it("Should check with existing solicitud", async () => {
      const token = jwt.sign({ numeroPaciente: 1 }, secret);
      const response = await request
        .get(
          `/v1/documentos_paciente/solicitudes/${existingSolicitudDocumento.tipoDocumento}/${existingSolicitudDocumento.correlativoDocumento}`
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ respuesta: true });
    });
  });
  describe("Get solicitudes documentos", () => {
    it("Should not get solicitudes documentos", async () => {
      const response = await request
        .get(`/v1/documentos_paciente/solicitudes/`)
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ respuesta: mensajes.forbiddenAccess });
    });
    it("Should get no solicitudes documentos from empty database", async () => {
      await SolicitudesDocumentos.deleteMany();
      const token = jwt.sign({ numeroPaciente: 1 }, secret);
      const response = await request
        .get(`/v1/documentos_paciente/solicitudes/`)
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });
    it("Should get solicitudes documentos", async () => {
      const token = jwt.sign({ numeroPaciente: 1 }, secret);
      const response = await request
        .get(`/v1/documentos_paciente/solicitudes/`)
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
    });
  });
});
