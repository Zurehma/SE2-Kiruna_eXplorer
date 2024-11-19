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

  describe("1. - GET /api/documents", () => {
    //add some documents
    const exampleData = [
      {
        title: "tittttttttttttt",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      },
      {
        title: "titttttttttttttttttt1",
        stakeholder: "stakeholder1",
        scale: 100,
        issuanceDate: "2014-02-12",
        type: "Prescriptive",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      }
    ] 
    test("1 - It should return 200 a list of all documents", async() => {
      //count all present documents in the database
      let countResult = await request(app)
      .get(basePath + "/documents")
      .set("Cookie", userCookie)
      .expect(200);
      let count = countResult.body.length;

      let result1 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleData[0])
        .expect(201);
      
      let result2 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleData[1])
        .expect(201);

      //get documents
      let res = await request(app)
        .get(basePath + "/documents")
        .set("Cookie", userCookie)
        .expect(200);

      expect(res.body.length).toBe(count+2);
    });
  
    test("2 - It should return 200 a list of all the filtered by type documents", async() => {
      //count all present documents in the database
      let countResult = await request(app)
      .get(basePath + "/documents"+"?type=Prescriptive")
      .set("Cookie", userCookie)
      .expect(200);
      let count = countResult.body.length;

      let result1 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleData[0])
        .expect(201);
      
      let result2 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleData[1])
        .expect(201);

      //get filtered documents
      let res = await request(app)
        .get(basePath + "/documents/"+"?type=Prescriptive")
        .set("Cookie", userCookie)
        .expect(200);

      expect(res.body.length).toBe(count+1);
      expect(res.body[0].type).toBe("Prescriptive");
    });

    test("3 - It should return 200 a list of all the filtered by stakeholder documents", async() => {
      //count all present documents in the database
      let countResult = await request(app)
      .get(basePath + "/documents/"+"?stakeholder=stakeholder")
      .set("Cookie", userCookie)
      .expect(200);
      let count = countResult.body.length;

      let result1 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleData[0])
        .expect(201);
      
      let result2 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleData[1])
        .expect(201);

      //get filtered documents
      let res = await request(app)
        .get(basePath + "/documents/"+"?stakeholder=stakeholder")
        .set("Cookie", userCookie)
        .expect(200);

      expect(res.body.length).toBe(count+1);
      expect(res.body[0].stakeholder).toBe("stakeholder");
    });

    test("4 - It should return 200 a list of all the documents in the range of the issuanceDate", async() => {
      //count all present documents in the database
      let countResult = await request(app)
      .get(basePath + "/documents"+"?issuanceDateFrom=2015-01-10&issuanceDateTo=2025-10-20")
      .set("Cookie", userCookie)
      .expect(200);
      let count = countResult.body.length;

      let result1 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleData[0])
        .expect(201);
      
      let result2 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleData[1])
        .expect(201);

      //get filtered documents
      let res = await request(app)
        .get(basePath + "/documents/"+"?issuanceDateFrom=2015-01-10&issuanceDateTo=2025-10-20")
        .set("Cookie", userCookie)
        .expect(200);

      expect(res.body.length).toBe(count+1);
    });

    test("5 - It should return 200 a list of all the documents with the specified issuanceDate", async() => {
      //count all present documents in the database
      let countResult = await request(app)
      .get(basePath + "/documents"+"?issuanceDateFrom=2014-02-12")
      .set("Cookie", userCookie)
      .expect(200);
      let count = countResult.body.length;

      let result1 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleData[0])
        .expect(201);
      
      let result2 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleData[1])
        .expect(201);

      //get filtered documents
      let res = await request(app)
        .get(basePath + "/documents/"+"?issuanceDateFrom=2014-02-12")
        .set("Cookie", userCookie)
        .expect(200);

      expect(res.body.length).toBe(count+1);
      expect(res.body[0].issuanceDate).toBe("2014-02-12");
    });
  });
  
  describe("2. - GET /api/documents/:id", () => {
    test("2.1 - It should return 200 the document with the specified id", async() => {

      //add some documents
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };
      const exampleDocumentData2 = {
        title: "title2",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };
      const exampleDocumentData3 = {
        title: "title3",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };

      let result1 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData)
        .expect(201);
      
      let result2 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData2)
        .expect(201);

      let result3 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData3)
        .expect(201);
      
      const responseExample = {
        id: result1.body.id,
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      }

      //get document by id
      let res = await request(app)
        .get(basePath + "/documents/" + result1.body.id)
        .set("Cookie", userCookie)
        .expect(200);

      expect(res.body).toMatchObject(responseExample);
    });
  
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
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };

      let result = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData)
        .expect(201);

      expect(result.body.title).toStrictEqual(exampleDocumentData.title);
      expect(result.body.stakeholder).toStrictEqual(exampleDocumentData.stakeholder);
      expect(result.body.scale).toStrictEqual(exampleDocumentData.scale);
      expect(result.body.issuanceDate).toStrictEqual(exampleDocumentData.issuanceDate);
      expect(result.body.type).toStrictEqual(exampleDocumentData.type);
      expect(result.body.language).toStrictEqual(exampleDocumentData.language);
      expect(result.body.description).toStrictEqual(exampleDocumentData.description);
      expect(result.body.pages).toStrictEqual(exampleDocumentData.pages);
      expect(result.body.coordinates).toStrictEqual(exampleDocumentData.coordinates);
  
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
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };

      let result = await request(app)
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

    test("1.5 - It should return 400 - Coordinates outside of Kiruna", async () => {
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 77.849982, "long": 20.217068},
        pages: 16
      };

      let result = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData)
        .expect(400);
      
    });

    
  });

  describe("2. - GET /api/documents/links/:id", () => {
    test("2.1 - It should return 200 and array of links", async() => {

      //add documents
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };
      const exampleDocumentData2 = {
        title: "title2",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };
      const exampleDocumentData3 = {
        title: "title3",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };

      let result = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData)
        .expect(201);
      
      let result2 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData2)
        .expect(201);

      let result3 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData3)
        .expect(201);

      //create links
      const links = {
        id1: result.body.id,
        ids: [result2.body.id, result3.body.id],
        type: "direct"
      }

      let resultLink = await request(app)
        .post(basePath + "/documents/link")
        .set("Cookie", userCookie)
        .send(links)
        .expect(200);

      const exampleLinksResponse = [
            {
              "linkedDocID": result2.body.id,
              "title": "title2",
              "type": "direct"
            },
            {
              "linkedDocID": result3.body.id,
              "title": "title3",
              "type": "direct"
            }
          ]
      

      //get links
      let resultGetLinks = await request(app)
        .get(basePath + "/documents/links/" + result.body.id)
        .set("Cookie", userCookie)
        .expect(200);

      expect(resultGetLinks.body).toMatchObject(exampleLinksResponse);

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
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };
      const exampleDocumentData2 = {
        title: "title2",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };
      const exampleDocumentData3 = {
        title: "title3",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };

      let result = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData)
        .expect(201);
      
      let result2 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData2)
        .expect(201);

      let result3 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData3)
        .expect(201);

      const links = {
        id1: result.body.id,
        ids: [result2.body.id, result3.body.id],
        type: "direct"
      }

      let resultLink = await request(app)
        .post(basePath + "/documents/link")
        .set("Cookie", userCookie)
        .send(links)
        .expect(200);
       
    });

    test("3.2 - It should return 401-unauthorized", async() => {

      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };
      const exampleDocumentData2 = {
        title: "title2",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };
      const exampleDocumentData3 = {
        title: "title3",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };

      let result = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData)
        .expect(201);
      
      let result2 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData2)
        .expect(201);

      let result3 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData3)
        .expect(201);

      const links = {
        id1: result.body.id,
        ids: [result2.body.id, result3.body.id],
        type: "direct"
      }

      let resultLink = await request(app)
        .post(basePath + "/documents/link")
        .send(links)
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
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };
      const exampleDocumentData2 = {
        title: "title2",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };
      const exampleDocumentData3 = {
        title: "title3",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };

      let result = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData)
        .expect(201);
      
      let result2 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData2)
        .expect(201);

      let result3 = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData3)
        .expect(201);

      const links = {
        id1: result.body.id,
        ids: [result2.body.id, result3.body.id],
        type: "direct"
      }

      let resultLink = await request(app)
        .post(basePath + "/documents/link")
        .set("Cookie", userCookie)
        .send(links)
        .expect(200);
      
      await request(app)
        .post(basePath + "/documents/link")
        .set("Cookie", userCookie)
        .send(links)
        .expect(409);
    });
  });

  describe("4. - GET /api/documents/document-types", () => {
    test("4.1 - It should return 200", async () => {
      await request(app)
        .get(basePath + "/documents/document-types")
        .set("Cookie", userCookie)
        .expect(200);
    });
  });

  describe("5. - GET/api/documents/stakeholders", () => {
    test("5.1 - It should return 200", async () => {
      await request(app)
        .get(basePath + "/documents/stakeholders")
        .set("Cookie", userCookie)
        .expect(200);
    });
  });

  describe("6. - GET /api/documents/link-types", () => {
    test("6.1 - It should return 200", async () => {
      await request(app)
        .get(basePath + "/documents/link-types")
        .set("Cookie", userCookie)
        .expect(200);
    });
    test("6.2 - It should return 401", async () => {
      await request(app)
        .get(basePath + "/documents/link-types")
        .expect(401);
    });
  });

  describe("7. - PUT /api/documents/:docID", () => {
    test("7.1 - It should return 204", async () => {
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };

      let result = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData)
        .expect(201);

      const modifiedDocumentData = {
        title: "title2",
        scale: 200,
        issuanceDate: "2024-02-10",
        language: "Swedish",
        description: "Lorem ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 20
      };

      await request(app)
        .put(basePath + "/documents/" + result.body.id)
        .set("Cookie", userCookie)
        .send(modifiedDocumentData)
        .expect(204);

    });

    test("7.2 - It should return 422 if issuance date later than today", async () => {
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };

      let result = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData)
        .expect(201);

      const modifiedDocumentData = {
        title: "title2",
        scale: 200,
        issuanceDate: "2024-02-10",
        language: "Swedish",
        description: "Lorem ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 20
      };

      await request(app)
        .put(basePath + "/documents/" + result.body.id)
        .set("Cookie", userCookie)
        .send({ ...exampleDocumentData, issuanceDate: dayjs().add(2, "day").format("YYYY-MM-DD") })
        .expect(400);

    });

    test("7.3 - It should return 400 if coordinates outside of Kiruna", async () => {
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 16
      };

      let result = await request(app)
        .post(basePath + "/documents")
        .set("Cookie", userCookie)
        .send(exampleDocumentData)
        .expect(201);

      const modifiedDocumentData = {
        title: "title2",
        scale: 200,
        issuanceDate: "2024-02-10",
        language: "Swedish",
        description: "Lorem ipsum...",
        coordinates: {"lat": 67.849982, "long": 20.217068},
        pages: 20
      };

      await request(app)
        .put(basePath + "/documents/" + result.body.id)
        .set("Cookie", userCookie)
        .send({ ...exampleDocumentData, coordinates: {"lat": 68.849982, "long": 20.217068} })
        .expect(400);

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


