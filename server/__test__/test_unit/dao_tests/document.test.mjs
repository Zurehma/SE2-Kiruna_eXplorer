import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import db from "../../../db/db.mjs";
import DocumentDAO from "../../../dao/documentDAO.mjs";
import Document from "../../../models/document.mjs";

jest.mock("../../../db/db.mjs");

/**
 * @type {DocumentDAO}
 */
let documentDAO;

describe("DocumentDAO", () => {
  describe("addDocument", () => {
    beforeEach(() => {
      documentDAO = new DocumentDAO();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    test("Insert successful", async () => {
      const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback.call({ lastID: 0, changes: 1 }, null);
      });

      const result = await documentDAO.addDocument(
        "example",
        "example",
        100,
        "2024-02-12",
        "Informative",
        "english",
        "Lore ipsum...",
        null,
        null,
        null,
        null,
        null
      );

      expect(result.lastID).toBeGreaterThanOrEqual(0);
      expect(result.changes).toBe(1);
      expect(mockDBRun).toHaveBeenCalled();
    });

    test("DB error", async () => {
      const error = new Error("");

      const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(error);
        return {};
      });

      const result = documentDAO.addDocument(
        "example",
        "example",
        100,
        "2024-02-12",
        "Informative",
        "english",
        "Lore ipsum...",
        null,
        null,
        null,
        null,
        null
      );

      await expect(result).rejects.toEqual(error);
      expect(mockDBRun).toHaveBeenCalled();
    });
  });

  describe("getDocumentById", () => {
    test("Get successful", async () => {
      const exampleDocumentRow = {
        id: 1,
        title: "example",
        stakeholder: "example",
        scale: "100",
        issuanceDate: "2024-02-12",
        type: "Informative",
        connections: 3,
        language: "english",
        description: "Lore ipsum...",
        pages: null,
        lat: null,
        long: null,
      };
      const exampleDocument = new Document(
        1,
        "example",
        "example",
        100,
        "2024-02-12",
        "Informative",
        3,
        "english",
        "Lore ipsum...",
        null,
        null,
        null
      );
      const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, exampleDocumentRow);
      });

      const result = await documentDAO.getDocumentByID(1);

      expect(result).toBeInstanceOf(Document);
      expect(result).toStrictEqual(exampleDocument);
      expect(mockDBGet).toHaveBeenCalled();
    });

    test("Document not found", async () => {
      const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, undefined);
      });

      const result = await documentDAO.getDocumentByID(1);

      expect(result).toStrictEqual(undefined);
      expect(mockDBGet).toHaveBeenCalled();
    });

    test("DB error", async () => {
      const error = new Error("");

      const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(error);
      });

      const result = documentDAO.getDocumentByID(1);

      await expect(result).rejects.toEqual(error);
      expect(mockDBGet).toHaveBeenCalled();
    });
  });

  describe("getDocuments", () => {
    test("Get successful", async () => {
      const documentsRow = [
        {
          id: 1,
          title: "Document 1",
          stakeholder: "Stakeholder",
          scale: 100,
          issuanceDate: "2023-01-01",
          type: "Informative",
          connections: 5,
          language: "english",
          description: "Description",
          pages: null,
          lat: null,
          long: null,
        },
        {
          id: 2,
          title: "Document 2",
          stakeholder: "Stakeholder",
          scale: 100,
          issuanceDate: "2023-01-01",
          type: "Informative",
          connections: 5,
          language: "english",
          description: "Description",
          pages: null,
          lat: null,
          long: null,
        }
      ]

      const documents = [
        new Document(1, 'Document 1', 'Stakeholder', 100, '2023-01-01', 'Informative', 5, 'english', 'Description',null, null, null, null, null),
        new Document(2, 'Document 2', 'Stakeholder', 100, '2023-01-01', 'Informative', 5, 'english', 'Description',null, null, null, null, null),
      ];

      const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null, documentsRow);
      });

      const result = await documentDAO.getDocuments();

      let doc1 = new Document();

      result.forEach((item) => {
        expect(item).toBeInstanceOf(Document);
        documents.forEach((doc) => {
          if(JSON.stringify(item) === JSON.stringify(doc)) {
              doc1 = doc;
            }
        });
        expect(item).toStrictEqual(doc1)
      });

      expect(mockDBAll).toHaveBeenCalled();
    });

    test("DB error", async () => {
      const error = new Error("");

      const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(error);
      });

      const result = documentDAO.getDocuments();

      await expect(result).rejects.toEqual(error);
      expect(mockDBAll).toHaveBeenCalled();
    });
  });

  describe("addLink", () => {
    beforeEach(() => {
      documentDAO = new DocumentDAO();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    test("Link insert successful", async () => {
      const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null, []);
      });

      const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback.call({ changes: 1 }, null);
      });

      const result = await documentDAO.addLink(1, 2, "Direct");
      expect(result.changes).toBe(1);
      expect(mockDBRun).toHaveBeenCalled();
      expect(mockDBAll).toHaveBeenCalled();
    });

    test("DB error on SELECT", async () => {
      const error = new Error("");

      const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(error, []);
      });

      const result = documentDAO.addLink(1, 2, "Direct");

      await expect(result).rejects.toEqual(error);
      expect(mockDBAll).toHaveBeenCalled();
    });

    test("DB error on INSERT", async () => {
      const error = new Error("");

      const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null, []);
      });

      const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(error);
        return {};
      });

      const result = documentDAO.addLink(1, 2, "Direct");

      await expect(result).rejects.toEqual(error);
      expect(mockDBRun).toHaveBeenCalled();
      expect(mockDBAll).toHaveBeenCalled();
    });

    test("Link already exists in same order", async () => {
      const docID1 = 1;
      const docID2 = 2;
      const error = { errCode: 409, errMessage:`Link already exists for ${docID1} and ${docID2}` };
      const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null, [{ docID1: 1, docID2: 2 }]);
      });

      const result = documentDAO.addLink(1, 2, "Direct");

      await expect(result).rejects.toEqual(error);
      expect(mockDBAll).toHaveBeenCalled;
    });

    test("Link already exists in reverse order", async () => {
      const docID1 = 1;
      const docID2 = 2;
      const error = { errCode: 409, errMessage:`Link already exists for ${docID1} and ${docID2}` };
      const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null, [{ docID1: 2, docID2: 1 }]);
      });

      const result = documentDAO.addLink(1, 2, "Direct");

      await expect(result).rejects.toEqual(error);
      expect(mockDBAll).toHaveBeenCalled;
    });
  });
});
