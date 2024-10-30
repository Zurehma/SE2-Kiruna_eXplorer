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

      const result = documentDAO.addDocument("example", "example", 100, "2024-02-12", "Informative", "english", "Lore ipsum...", null, null, null);

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
        scale: 100,
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
});
