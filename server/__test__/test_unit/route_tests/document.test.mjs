import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import DocumentDAO from "../../../dao/documentDAO.mjs";
import { app } from "../../../index.mjs";
import request from "supertest";

import { delete_table } from "../../../db/db_utils.mjs";
import db from "../../../db/db.mjs";

let baseURL = "/api/documents";

beforeAll(async () => {
  // console.log("Node environment: ", process.env.NODE_ENV);
  let info = await delete_table(db, "document");
});

afterAll(async () => {
  let info = await delete_table(db, "document");
});

describe("DocumentRoutes", () => {

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
