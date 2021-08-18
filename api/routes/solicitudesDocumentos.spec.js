const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Documentos = require("../models/documentos");
const SolicitudesDocumentos = require("../models/SolicitudesDocumentos");
const documentosSeed = require("../testSeeds/documentosSeed.json");
const solicitudesDocumentosSeed = require("../testSeeds/solicitudesDocumentosSeed.json");
const { getMensajes } = require("../config");
const ConfigApiDocumentos = require("../models/ConfigApiDocumentos");
const configSeed = require("../testSeeds/configSeed.json");

const request = supertest(app);

const secreto = process.env.JWT_SECRET;
let token;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(
    `${process.env.MONGO_URI_TEST}solicitudes_documentos_test`,
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
  correlativoDocumento: "2",
  tipoDocumento: "DAU",
};

const newSolicitudDocumento = {
  idDocumento: "000000000002",
  correlativoDocumento: "3",
  tipoDocumento: "DAU",
};

describe("Endpoints solicitudes documentos", () => {
  describe("POST /v1/documentos-paciente/solicitudes", () => {
    describe("Validate body", () => {
      it("Should not create solicitud documento wrong tipoDocumento", async () => {
        token = jwt.sign(
          {
            _id: "000000000000",
            numerosPaciente: [
              {
                numero: 1,
                codigoEstablecimiento: "E01",
                hospital: {
                  E01: 1
                },
                nombreEstablecimiento: "Hospital Regional de Antofagasta",
              },
              {
                numero: 5,
                codigoEstablecimiento: "E02",
                hospital: {
                  E02: 1
                },
                nombreEstablecimiento: "Hospital de Calama",
              },
            ],
          },
          secreto
        );
        const badSolicitudDocumento = {
          correlativoDocumento: 11,
          tipoDocumento: 1,
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
      it("Should not create solicitud documento wrong correlativoDocumento", async () => {
        token = jwt.sign(
          {
            _id: "000000000000",
            numerosPaciente: [
              {
                numero: 1,
                codigoEstablecimiento: "E01",
                hospital: {
                  E01: 1
                },
                nombreEstablecimiento: "Hospital Regional de Antofagasta",
              },
              {
                numero: 5,
                codigoEstablecimiento: "E02",
                hospital: {
                  E02: 1
                },
                nombreEstablecimiento: "Hospital de Calama",
              },
            ],
          },
          secreto
        );
        const badSolicitudDocumento = {
          correlativoDocumento: 111,
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
            numerosPaciente: [
              {
                numero: 1,
                codigoEstablecimiento: "E01",
                hospital: {
                  E01: 1
                },
                nombreEstablecimiento: "Hospital Regional de Antofagasta",
              },
              {
                numero: 5,
                codigoEstablecimiento: "E02",
                hospital: {
                  E02: 1
                },
                nombreEstablecimiento: "Hospital de Calama",
              },
            ],
          },
          secreto
        );
        const badSolicitudDocumento = {
          correlativoDocumento: 11,
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
      it("Should not create solicitud documento without correlativoDocumento", async () => {
        token = jwt.sign(
          {
            _id: "000000000000",
            numerosPaciente: [
              {
                numero: 1,
                codigoEstablecimiento: "E01",
                hospital: {
                  E01: 1
                },
                nombreEstablecimiento: "Hospital Regional de Antofagasta",
              },
              {
                numero: 5,
                codigoEstablecimiento: "E02",
                hospital: {
                  E02: 1
                },
                nombreEstablecimiento: "Hospital de Calama",
              },
            ],
          },
          secreto
        );
        const badSolicitudDocumento = {
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
            numerosPaciente: [
              {
                numero: 1,
                codigoEstablecimiento: "E01",
                hospital: {
                  E01: 1
                },
                nombreEstablecimiento: "Hospital Regional de Antofagasta",
              },
              {
                numero: 5,
                codigoEstablecimiento: "E02",
                hospital: {
                  E02: 1
                },
                nombreEstablecimiento: "Hospital de Calama",
              },
            ],
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
    it("Should not create solicitud documento if there is an equal solicitud pending", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          numerosPaciente: [
            {
              numero: 1,
              codigoEstablecimiento: "E01",
              hospital: {
                E01: 1
              },
              nombreEstablecimiento: "Hospital Regional de Antofagasta",
            },
            {
              numero: 5,
              codigoEstablecimiento: "E02",
              hospital: {
                E02: 1
              },
              nombreEstablecimiento: "Hospital de Calama",
            },
          ],
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
          numerosPaciente: [
            {
              numero: 1,
              codigoEstablecimiento: "E01",
              hospital: {
                E01: 1
              },
              nombreEstablecimiento: "Hospital Regional de Antofagasta",
            },
            {
              numero: 5,
              codigoEstablecimiento: "E02",
              hospital: {
                E02: 1
              },
              nombreEstablecimiento: "Hospital de Calama",
            },
          ],
        },
        secreto
      );
      const response = await request
        .post(`/v1/documentos-paciente/solicitudes`)
        .set("Authorization", token)
        .send(newSolicitudDocumento);

      const filter = {
        numeroPaciente: {
          numero: 1,
          codigoEstablecimiento: "E01",
          hospital: {
            E01: 1
          },
          nombreEstablecimiento: "Hospital Regional de Antofagasta",
        },
        tipoDocumento: newSolicitudDocumento.tipoDocumento,
        correlativoDocumento: newSolicitudDocumento.correlativoDocumento,
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

      expect(solicitudCreada.numeroPaciente.numero).toBeFalsy();
      expect(solicitudCreada.numeroPaciente.codigoEstablecimiento).toBeFalsy();
      expect(solicitudCreada.numeroPaciente.nombreEstablecimiento).toBe(
        "Hospital Regional de Antofagasta"
      );
      expect(solicitudCreada.correlativoDocumento).toBe(
        newSolicitudDocumento.correlativoDocumento
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
          `/v1/documentos-paciente/solicitudes/existe/${newSolicitudDocumento.idDocumento}`
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
          numerosPaciente: [
            {
              numero: 1,
              codigoEstablecimiento: "E01",
              hospital: {
                E01: 1
              },
              nombreEstablecimiento: "Hospital Regional de Antofagasta",
            },
            {
              numero: 5,
              codigoEstablecimiento: "E02",
              hospital: {
                E02: 1
              },
              nombreEstablecimiento: "Hospital de Calama",
            },
          ],
        },
        secreto
      );
      const response = await request
        .get(
          `/v1/documentos-paciente/solicitudes/existe/${newSolicitudDocumento.idDocumento}`
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ existeSolicitud: false });
    });
    it("Should check with non existing solicitud", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          numerosPaciente: [
            {
              numero: 1,
              codigoEstablecimiento: "E01",
              hospital: {
                E01: 1
              },
              nombreEstablecimiento: "Hospital Regional de Antofagasta",
            },
            {
              numero: 5,
              codigoEstablecimiento: "E02",
              hospital: {
                E02: 1
              },
              nombreEstablecimiento: "Hospital de Calama",
            },
          ],
        },
        secreto
      );
      const response = await request
        .get(
          `/v1/documentos-paciente/solicitudes/existe/${newSolicitudDocumento.idDocumento}`
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ existeSolicitud: false });
    });
    it("Should check with existing solicitud", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          numerosPaciente: [
            {
              numero: 1,
              codigoEstablecimiento: "E01",
              hospital: {
                E01: 1
              },
              nombreEstablecimiento: "Hospital Regional de Antofagasta",
            },
            {
              numero: 5,
              codigoEstablecimiento: "E02",
              hospital: {
                E02: 1
              },
              nombreEstablecimiento: "Hospital de Calama",
            },
          ],
        },
        secreto
      );
      const response = await request
        .get(
          `/v1/documentos-paciente/solicitudes/existe/${existingSolicitudDocumento.idDocumento}`
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
          numerosPaciente: [
            {
              numero: 1,
              codigoEstablecimiento: "E01",
              hospital: {
                E01: 1
              },
              nombreEstablecimiento: "Hospital Regional de Antofagasta",
            },
            {
              numero: 5,
              codigoEstablecimiento: "E02",
              hospital: {
                E02: 1
              },
              nombreEstablecimiento: "Hospital de Calama",
            },
          ],
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
          numerosPaciente: [
            {
              numero: 1,
              codigoEstablecimiento: "E01",
              hospital: {
                E01: 1
              },
              nombreEstablecimiento: "Hospital Regional de Antofagasta",
            },
            {
              numero: 5,
              codigoEstablecimiento: "E02",
              hospital: {
                E02: 1
              },
              nombreEstablecimiento: "Hospital de Calama",
            },
          ],
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
