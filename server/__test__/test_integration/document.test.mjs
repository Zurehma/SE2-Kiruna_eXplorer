import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import request from "supertest";
import dayjs from "dayjs";
import { app } from "../../index.mjs";
import cleanup from "../../db/cleanup.mjs";

const basePath = "/api";
let userData = { username: "username", name: "name", surname: "surname", password: "password", role: "Urban Planner" };
let userCookie;

const createUser = async (userData) => {
  await request(app)
    .post(basePath + "/sessions/register")
    .send(userData)
    .expect(200);
};
const loginUser = async (userData) => {
  return new Promise((resolve, reject) => {
    request(app)
      .post(basePath + "/sessions/login")
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.header["set-cookie"][0]);
        }
      });
  });
};

describe("DocumentRoutes", () => {
  beforeAll(async () => {
    await cleanup();
    await createUser(userData);
    userCookie = await loginUser(userData);
  });

  afterAll(async () => {
    await cleanup();
  });

  describe("1. - POST /api/documents", () => {
    test("1.1 - It should return 200", async () => {
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        pages: 16,
        pageFrom: 1,
        pageTo: 17,
      };

      let result = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData)
        .expect(200);

      expect(result.body.title).toStrictEqual(exampleDocumentData.title);
      expect(result.body.stakeholder).toStrictEqual(exampleDocumentData.stakeholder);
      expect(result.body.scale).toStrictEqual(exampleDocumentData.scale);
      expect(result.body.issuanceDate).toStrictEqual(exampleDocumentData.issuanceDate);
      expect(result.body.type).toStrictEqual(exampleDocumentData.type);
      expect(result.body.language).toStrictEqual(exampleDocumentData.language);
      expect(result.body.description).toStrictEqual(exampleDocumentData.description);
      expect(result.body.pages).toStrictEqual(exampleDocumentData.pages);
      expect(result.body.pageFrom).toStrictEqual(exampleDocumentData.pageFrom);
      expect(result.body.pageTo).toStrictEqual(exampleDocumentData.pageTo);
      expect(result.body.lat).toBe(null);
      expect(result.body.long).toBe(null);
    });

    test("1.2 - It should return 401", async () => {
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        pages: 16,
        pageFrom: 1,
        pageTo: 17,
      };

      await request(app)
        .post(basePath + "/documents")
        .send(exampleDocumentData)
        .expect(401);
    });

    test("1.3 - It should return 422", async () => {
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
      };

      await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send({ ...exampleDocumentData, title: 10 })
        .expect(422);
      await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send({ ...exampleDocumentData, stakeholder: 10 })
        .expect(422);
      await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send({ ...exampleDocumentData, issuanceDate: "2024-13-01" })
        .expect(422);
      await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send({ ...exampleDocumentData, issuanceDate: "01/07/2024" })
        .expect(422);
      await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send({ ...exampleDocumentData, pages: "wrong" })
        .expect(422);
      await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send({ ...exampleDocumentData, pageFrom: 100 })
        .expect(422);
      await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send({ ...exampleDocumentData, pageTo: 23 })
        .expect(422);
    });

    test("1.4 - It should return 400 - Date error", async () => {
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
      };

      await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send({ ...exampleDocumentData, issuanceDate: dayjs().add(2, "day").format("YYYY-MM-DD") })
        .expect(400);
    });

    test("1.5 - It should return 400 - Document type error", async () => {
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
      };

      await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send({ ...exampleDocumentData, type: "wrong" })
        .expect(400);
    });

    test("1.6 - It should return 400 - Scale type error", async () => {
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
      };

      await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send({ ...exampleDocumentData, scale: "wrong" })
        .expect(400);
    });
  });
});
