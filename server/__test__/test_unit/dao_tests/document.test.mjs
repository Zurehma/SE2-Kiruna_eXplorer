import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import db from "../../../db/db.mjs";
import DocumentDAO from "../../../dao/documentDAO.mjs";
import Document from "../../../models/document.mjs";

jest.mock("../../../db/db.mjs");

/**
 * @type {DocumentDAO}
 */
let documentDAO;

const mapRowsToDocument = (rows) => {
  return rows.map(
    (row) =>
      new Document(
        row.id,
        row.title,
        row.stakeholder,
        row.scale,
        row.issuanceDate,
        row.type,
        row.connections,
        row.language,
        row.description,
        row.coordinates || null,
        row.pages || null,
        row.pageFrom || null,
        row.pageTo || null
      )
  );
};

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

  describe("updateDocument", () => {
    beforeEach(() => {
      documentDAO = new DocumentDAO();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    test("Update successful", async () => {
      const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback.call({ changes: 1, lastID: 1}, null);
      });

      const result = await documentDAO.updateDocument(
        1,
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

      expect(result.lastID).toBe(1);
      expect(result.changes).toBe(1);

    });

    test("DB error", async () => {
      const error = new Error("");

      const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(error);
        return {};
      });

      const result = documentDAO.updateDocument(
        1,
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
    const documentsTestData = {
      "filerOut": [{
        id: 5,
        title: "Document 2",
        stakeholder: "Stakeholder",
        scale: 100,
        issuanceDate: "2023-01-01",
        type: "Design",
        connections: 5,
        language: "english",
        description: "Desc",
        coordinates: null,
        pages: null,
        pageFrom: null,
        pageTo: null
      },
      {
        id: 6,
        title: "Document 2",
        stakeholder: "Stakeholder",
        scale: 100,
        issuanceDate: "2023-01-01",
        type: "Design",
        connections: 5,
        language: "english",
        description: "Desc",
        coordinates: null,
        pages: null,
        pageFrom: null,
        pageTo: null
      }
    ]
    }

    beforeEach(() => {
      documentDAO = new DocumentDAO();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    test("All documents retrieved", async () => {
      let stakeholderApplied = mapRowsToDocument(documentsTestData.filerOut);

      const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null, stakeholderApplied);
      });

      const result = await documentDAO.getDocuments({ stakeholder: "Stakeholder" });

      for(let i = 0; i < result.length; i++) {
        expect(result[i]).toStrictEqual(stakeholderApplied[i]);
      }

      expect(mockDBAll).toHaveBeenCalled();
    });


    test("DB error, no documents found", async () => {
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
      const error = { errCode: 409, errMessage: `Link already exists for ${docID1} and ${docID2}` };
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
      const error = { errCode: 409, errMessage: `Link already exists for ${docID1} and ${docID2}` };
      const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null, [{ docID1: 2, docID2: 1 }]);
      });

      const result = documentDAO.addLink(1, 2, "Direct");

      await expect(result).rejects.toEqual(error);
      expect(mockDBAll).toHaveBeenCalled;
    });
  });

  describe('getting types', () => {
    beforeEach(() => {
      documentDAO = new DocumentDAO();
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    test('getStakeholders', async () => {
      const stakeholders = ['stakeholder1', 'stakeholder2'];
      const mockDBAll = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
        callback(null, stakeholders);
      });

      const result = await documentDAO.getStakeholders();
      expect(result).toStrictEqual(stakeholders);
      expect(mockDBAll).toHaveBeenCalled();
    });

    test("error on DB getStakeholders", async () => {
      const error = new Error("");
      const mockDBAll = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
        callback(error);
      });

      const result = documentDAO.getStakeholders();
      await expect(result).rejects.toEqual(error);
      expect(mockDBAll).toHaveBeenCalled();
    });

    test('getDocumentTypes', async () => {
      const types = ['type1', 'type2'];
      const mockDBAll = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
        callback(null, types);
      });

      const result = await documentDAO.getDocumentTypes();
      expect(result).toStrictEqual(types);
      expect(mockDBAll).toHaveBeenCalled();
    });

    test("error on DB getDocumentTypes", async () => {
      const error = new Error("");
      const mockDBAll = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
        callback(error);
      });

      const result = documentDAO.getDocumentTypes();
      await expect(result).rejects.toEqual(error);
      expect(mockDBAll).toHaveBeenCalled();
    });

    test('getLinkTypes', async () => {
      const types = ['type1', 'type2'];
      const mockDBAll = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
        callback(null, types);
      });

      const result = await documentDAO.getLinkTypes();
      expect(result).toStrictEqual(types);
      expect(mockDBAll).toHaveBeenCalled();
    });

    test("error on DB getLinkTypes", async () => {
      const error = new Error("");
      const mockDBAll = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
        callback(error);
      });

      const result = documentDAO.getLinkTypes();
      await expect(result).rejects.toEqual(error);
      expect(mockDBAll).toHaveBeenCalled();
    });
  });


  describe('getLinks', () => {
    beforeEach(() => {
      documentDAO = new DocumentDAO();
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    test("getLinks successful", async () => {
      const links = [
        { linkedDocID: 2, title: 'Document 2', type: 'Direct' },
        { linkedDocID: 3, title: 'Document 3', type: 'Projection' }
      ];

      const mockDBAll = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
        callback(null, links);
      });

      const result = await documentDAO.getLinks(1);
      expect(result).toStrictEqual(links);
      expect(mockDBAll).toHaveBeenCalled();
    });

    test("error on DB getLinks", async () => {
      const error = new Error("");
      const mockDBAll = jest.spyOn(db, 'all').mockImplementation((sql, params, callback) => {
        callback(error);
      });

      const result = documentDAO.getLinks(1);
      await expect(result).rejects.toEqual(error);
      expect(mockDBAll).toHaveBeenCalled();
    });

  });


});
