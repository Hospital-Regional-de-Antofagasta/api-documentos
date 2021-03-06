const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Documentos = require("../api/models/Documentos");
const SolicitudesDocumentos = require("../api/models/SolicitudesDocumentos");
const documentosSeed = require("./testSeeds/documentosSeed.json");
const solicitudesDocumentosSeed = require("./testSeeds/solicitudesDocumentosSeed.json");
const { getMensajes } = require("../api/config");
const ConfigApiDocumentos = require("../api/models/ConfigApiDocumentos");
const configSeed = require("./testSeeds/configSeed.json");

const request = supertest(app);

const secreto = process.env.JWT_SECRET;
let token;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(
    `${process.env.MONGO_URI}/solicitudes_documentos_test`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  await Documentos.create(documentosSeed);
  await SolicitudesDocumentos.create(solicitudesDocumentosSeed);
  await ConfigApiDocumentos.create(configSeed);
});

afterEach(async () => {
  await Documentos.deleteMany();
  await SolicitudesDocumentos.deleteMany();
  await ConfigApiDocumentos.deleteMany();
  await mongoose.disconnect();
});

const existingSolicitudDocumento = {
  idDocumento: "000000000003",
  codigoEstablecimiento: "HRA",
  identificadorDocumento: "8",
  tipoDocumento: "DAU",
};

const newSolicitudDocumento = {
  idDocumento: "000000000002",
  codigoEstablecimiento: "HRA",
  identificadorDocumento: "12",
  tipoDocumento: "DAU",
};

describe("Endpoints solicitudes documentos", () => {
  describe("POST /v1/documentos-paciente/solicitudes", () => {
    describe("Validate body", () => {
      it("Should not create solicitud documento wrong tipoDocumento", async () => {
        token = jwt.sign(
          {
            _id: "000000000000",
            rut: "11111111-1",
          },
          secreto
        );
        const badSolicitudDocumento = {
          codigoEstablecimiento: "HRA",
          identificadorDocumento: "1",
          tipoDocumento: "DA",
        };
        const response = await request
          .post(`/v1/documentos-paciente/solicitudes`)
          .set("Authorization", token)
          .send(badSolicitudDocumento);

        const mensaje = await getMensajes("badRequest");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          respuesta: {
            titulo: mensaje.titulo,
            mensaje: mensaje.mensaje,
            color: mensaje.color,
            icono: mensaje.icono,
          },
        });
      });
      it("Should not create solicitud documento wrong identificadorDocumento", async () => {
        token = jwt.sign(
          {
            _id: "000000000000",
            rut: "11111111-1",
          },
          secreto
        );
        const badSolicitudDocumento = {
          codigoEstablecimiento: "HRA",
          identificadorDocumento: "111",
          tipoDocumento: "DAU",
        };
        const response = await request
          .post(`/v1/documentos-paciente/solicitudes`)
          .set("Authorization", token)
          .send(badSolicitudDocumento);

        const mensaje = await getMensajes("badRequest");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          respuesta: {
            titulo: mensaje.titulo,
            mensaje: mensaje.mensaje,
            color: mensaje.color,
            icono: mensaje.icono,
          },
        });
      });
      it("Should not create solicitud documento without tipoDocumento", async () => {
        token = jwt.sign(
          {
            _id: "000000000000",
            rut: "11111111-1",
          },
          secreto
        );
        const badSolicitudDocumento = {
          codigoEstablecimiento: "HRA",
          identificadorDocumento: "1",
        };
        const response = await request
          .post(`/v1/documentos-paciente/solicitudes`)
          .set("Authorization", token)
          .send(badSolicitudDocumento);

        const mensaje = await getMensajes("badRequest");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          respuesta: {
            titulo: mensaje.titulo,
            mensaje: mensaje.mensaje,
            color: mensaje.color,
            icono: mensaje.icono,
          },
        });
      });
      it("Should not create solicitud documento without identificadorDocumento", async () => {
        token = jwt.sign(
          {
            _id: "000000000000",
            rut: "11111111-1",
          },
          secreto
        );
        const badSolicitudDocumento = {
          codigoEstablecimiento: "HRA",
          tipoDocumento: "DAU",
        };
        const response = await request
          .post(`/v1/documentos-paciente/solicitudes`)
          .set("Authorization", token)
          .send(badSolicitudDocumento);

        const mensaje = await getMensajes("badRequest");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          respuesta: {
            titulo: mensaje.titulo,
            mensaje: mensaje.mensaje,
            color: mensaje.color,
            icono: mensaje.icono,
          },
        });
      });
      it("Should not create solicitud documento without fields", async () => {
        token = jwt.sign(
          {
            _id: "000000000000",
            rut: "11111111-1",
          },
          secreto
        );
        const badSolicitudDocumento = {};
        const response = await request
          .post(`/v1/documentos-paciente/solicitudes`)
          .set("Authorization", token)
          .send(badSolicitudDocumento);

        const mensaje = await getMensajes("badRequest");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          respuesta: {
            titulo: mensaje.titulo,
            mensaje: mensaje.mensaje,
            color: mensaje.color,
            icono: mensaje.icono,
          },
        });
      });
    });
    it("Should not create solicitud documento without token", async () => {
      const response = await request
        .post(`/v1/documentos-paciente/solicitudes`)
        .set("Authorization", "no-token")
        .send(newSolicitudDocumento);

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
    it("Should not create solicitud documento if there is a pending solicitud for the same documento", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          rut: "11111111-1",
        },
        secreto
      );
      const response = await request
        .post(`/v1/documentos-paciente/solicitudes`)
        .set("Authorization", token)
        .send(existingSolicitudDocumento);

      const mensaje = await getMensajes("badRequest");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Should create solicitud documento", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          rut: "11111111-1",
        },
        secreto
      );
      const response = await request
        .post(`/v1/documentos-paciente/solicitudes`)
        .set("Authorization", token)
        .send(newSolicitudDocumento);

      const filter = {
        rutPaciente: "11111111-1",
        codigoEstablecimiento: "HRA",
        tipoDocumento: newSolicitudDocumento.tipoDocumento,
        identificadorDocumento: newSolicitudDocumento.identificadorDocumento,
      };
      const solicitudCreada = await SolicitudesDocumentos.findOne(
        filter
      ).exec();

      const mensaje = await getMensajes("solicitudCreada");

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });

      expect(solicitudCreada.rutPaciente).toBeFalsy();
      expect(solicitudCreada.codigoEstablecimiento).toBe(
        newSolicitudDocumento.codigoEstablecimiento
      );
      expect(solicitudCreada.identificadorDocumento).toBe(
        newSolicitudDocumento.identificadorDocumento
      );
      expect(solicitudCreada.tipoDocumento).toBe(
        newSolicitudDocumento.tipoDocumento
      );
    });
  });
  describe("GET /v1/documentos-paciente/solicitudes/existe/:idDocumento", () => {
    it("Should not check without token", async () => {
      const response = await request
        .get(
          `/v1/documentos-paciente/solicitudes/existe/000000000002`
        )
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
    it("Should check on empty database", async () => {
      await SolicitudesDocumentos.deleteMany();
      token = jwt.sign(
        {
          _id: "000000000000",
          rut: "11111111-1",
        },
        secreto
      );
      const response = await request
        .get(
          `/v1/documentos-paciente/solicitudes/existe/000000000002`
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ existeSolicitud: false });
    });
    it("Should check with non existing solicitud", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          rut: "11111111-1",
        },
        secreto
      );
      const response = await request
        .get(
          `/v1/documentos-paciente/solicitudes/existe/000000000002`
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ existeSolicitud: false });
    });
    it("Should check with existing solicitud", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          rut: "11111111-1",
        },
        secreto
      );
      const response = await request
        .get(
          `/v1/documentos-paciente/solicitudes/existe/000000000003`
        )
        .set("Authorization", token);

      const mensaje = await getMensajes("solicitudDuplicada");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        existeSolicitud: true,
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
  });
  describe("GET /v1/documentos-paciente/solicitudes", () => {
    it("Should not get solicitudes documentos", async () => {
      const response = await request
        .get(`/v1/documentos-paciente/solicitudes`)
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
    it("Should get no solicitudes documentos from empty database", async () => {
      await SolicitudesDocumentos.deleteMany();
      token = jwt.sign(
        {
          _id: "000000000000",
          rut: "11111111-1",
        },
        secreto
      );
      const response = await request
        .get(`/v1/documentos-paciente/solicitudes`)
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });
    it("Should get solicitudes documentos", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          rut: "11111111-1",
        },
        secreto
      );
      const response = await request
        .get(`/v1/documentos-paciente/solicitudes`)
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
    });
  });
});
