import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import request from "supertest";
import dayjs from "dayjs";
import { app } from "../../index.mjs";
import cleanup from "../../db/cleanup.mjs";
import DocumentDAO from "../../dao/documentDAO.mjs";

import { delete_table } from "../../db/db_utils.mjs";
import db from "../../db/db.mjs";

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


  describe("3. - POST /api/documents/link", () => {  

    test("3.1 - It should return 200", async() => {
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
      const exampleDocumentData2 = {
        title: "title2",
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
      
      let result2 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData2)
        .expect(200);

      const link = {
        id1: result.body.id,
        id2: result2.body.id,
        type: "direct"
      }

      let resultLink = await request(app)
        .post(basePath + "/documents/link")
        .set("Cookie", userCookie)
        .send(link)
        .expect(200);

       expect(resultLink.body.id1).toEqual(result.body.id);
       expect(resultLink.body.id2).toEqual(result2.body.id);
       
    });

    test("3.2 - It should return 401-unauthorize", async() => {

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
      const exampleDocumentData2 = {
        title: "title2",
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
      
      let result2 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData2)
        .expect(200);

      const link = {
        id1: result.body.id,
        id2: result2.body.id,
        type: "direct"
      }

      await request(app)
        .post(basePath + "/documents/link")
        .send(link)
        .expect(401);

    });

    test("3.3 - It should retun 409-link exists", async() => {
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
      const exampleDocumentData2 = {
        title: "title2",
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
      
      let result2 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData2)
        .expect(200);

      const link = {
        id1: result.body.id,
        id2: result2.body.id,
        type: "direct"
      }

      await request(app)
        .post(basePath + "/documents/link")
        .set("Cookie", userCookie)
        .send(link)
        .expect(200);
      
      await request(app)
        .post(basePath + "/documents/link")
        .set("Cookie", userCookie)
        .send(link)
        .expect(409);
    });
  });

});

describe("AuthRoutes", () => {
  beforeAll(async () => {
    await cleanup();
    await createUser(userData);
    userCookie = await loginUser(userData);
  });

  afterAll(async () => {
    await cleanup();
  });

  describe("2. - POST /api/sessions/login", () => {
    test("2.1 - It should return 200", async () => {
      await request(app)
        .post(basePath + "/sessions/login")
        .send(userData)
        .expect(200);
    });

    test("2.2 - It should return 401", async () => {
      await request(app)
        .post(basePath + "/sessions/login")
        .send({ ...userData, password: "wrong" })
        .expect(401);
    });
  });

  describe("3. - DELETE /api/sessions/logout", () => {
    test("3.1 - It should return 200", async () => {
      await request(app)
        .delete(basePath + "/sessions/logout")
        .set("Cookie", userCookie)
        .expect(200);
    });
  });

});


let baseURL = "/api/documents";

describe("DocumentRoutes", () => {

  beforeAll(async () => {
    // console.log("Node environment: ", process.env.NODE_ENV);
    let info = await delete_table(db, "document");
  });
  
  afterAll(async () => {
    let info = await delete_table(db, "document");
  });

  let documentDAO = new DocumentDAO();

  describe("GET api/documents", () => {
    let mockDocumentController;
    let testDocument;
    beforeEach(async () => {
      let res = await documentDAO.addDocument("Document 1", "Stakeholder", "test", "2023-01-01", "Informative", "english", "Description", null, null, null, null, null);
      // console.log(res);
    });

    afterEach(() => {
      delete_table(db, "document");
    });

    it("It should return 200 status code and a list of all documents", async () => {

      const response = await request(app)
        .get(baseURL);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject([{
        title: "Document 1",
        stakeholder: "Stakeholder",
        scale: "test",
        issuanceDate: "2023-01-01",
        type: "Informative",
        pages: null
      }]);
    });
  });

}); 
