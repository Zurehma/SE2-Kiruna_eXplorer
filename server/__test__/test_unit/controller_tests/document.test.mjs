import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import DocumentController from "../../../controllers/documentController.mjs";
import Document from "../../../models/document.mjs";
import DocumentDAO from "../../../dao/documentDAO.mjs";
import dayjs from "dayjs";
import Utility from "../../../utils/utility.mjs";

jest.mock("../../../dao/documentDAO");

const mapRowsToDocument = (documentRows, stakeholderRows) => {
  return documentRows.map(
    (row) =>
      new Document(
        row.id,
        row.title,
        stakeholderRows.filter((stakeholderRow) => stakeholderRow.docID === row.id).map((stakeholderRow) => stakeholderRow.stakeholder),
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

describe("DocumentController", () => {
  describe("getDocuments", () => {
    /**
     * @type {DocumentController}
     */
    let documentController;
    let documentDAO;

    const exampleDocumentData = {
      filerOut: [
        {
          id: 5,
          title: "Document 1",
          scale: 100,
          issuanceDate: "2023-01-01",
          type: "Design",
          connections: 5,
          language: "english",
          description: "Desc",
          coordinates: null,
          pages: null,
          pageFrom: null,
          pageTo: null,
        },
        {
          id: 6,
          title: "Document 2",
          scale: 100,
          issuanceDate: "2023-01-01",
          type: "Design",
          connections: 5,
          language: "english",
          description: "Desc",
          coordinates: null,
          pages: null,
          pageFrom: null,
          pageTo: null,
        },
      ],
    };

    const stakeholderRows = [{ docID: 5, stakeholder: "Stakeholder" }, { docID: 6, stakeholder: "Stakeholder" }];

    beforeEach(() => {
      documentDAO = new DocumentDAO();
      documentController = new DocumentController();
      documentDAO = documentController.documentDAO;
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    test("All Documents retrieved successfully", async () => {
      jest.spyOn(documentDAO, "getDocuments").mockResolvedValue(exampleDocumentData);
      let response = await documentController.getDocuments();

      expect(documentDAO.getDocuments).toHaveBeenCalled();

      for (let i = 0; i < exampleDocumentData.length; i++) {
        expect(response[i]).toBe(mapRowsToDocument(exampleDocumentData[i], stakeholderRows));
      }
    });
  });

  describe("getDocumentById", () => {
    /**
     * @type {DocumentController}
     */
    let documentController;
    let documentDAO;

    const exampleDocument = new Document(5, "Document 2", "Stakeholder", 100, "2023-01-01", "Design", 5, "english", "Desc", null, null, null, null);

    beforeEach(() => {
      documentDAO = new DocumentDAO();
      documentController = new DocumentController();
      documentDAO = documentController.documentDAO;
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    test("Document retrieved successfully", async () => {
      jest.spyOn(documentDAO, "getDocumentByID").mockResolvedValue(exampleDocument);
      let response = await documentController.getDocumentById(5);

      expect(documentDAO.getDocumentByID).toHaveBeenCalled();
      expect(documentDAO.getDocumentByID).toHaveBeenCalledWith(5);

      expect(response).toBe(exampleDocument);
    });

    test("ID doesn't exist", async () => {
      const error = new Error("");

      jest.spyOn(documentDAO, "getDocumentByID").mockResolvedValue(undefined);
      let result = documentController.getDocumentById(5);

      expect(result).rejects.toEqual({ errCode: 404, errMessage: "Document not found." });
    });
  });

  describe("addDocument", () => {
    /**
     * @type {DocumentController}
     */
    let documentController;
    let documentDAO;

    beforeEach(() => {
      documentController = new DocumentController();
      documentDAO = new DocumentDAO();
      documentController.documentDAO = documentDAO;
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    test("Document added successfully", async () => {
      const exampleAddResult = { lastID: 12, changes: 1 };
      const exampleDocumentData = {
        title: "title",
        stakeholders: ["stakeholder", "stakeholder2"],
        scale: 100,
        issuanceDate: "2016-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat":67.849982, "long":20.217068},
        pages: 16,
      };

      const exampleDocument = new Document(
        exampleAddResult.lastID,
        exampleDocumentData.title,
        exampleDocumentData.stakeholders,
        exampleDocumentData.scale,
        exampleDocumentData.issuanceDate,
        exampleDocumentData.type,
        0,
        exampleDocumentData.language,
        exampleDocumentData.description,
        JSON.stringify(exampleDocumentData.coordinates),
        exampleDocumentData.pages,
        exampleDocumentData.pageFrom,
        exampleDocumentData.pageTo
      );

      Utility.isValidKirunaCoordinates = jest.fn().mockReturnValue(true);
      documentDAO.addDocument = jest.fn().mockResolvedValueOnce(exampleAddResult);
      documentDAO.addStakeholder = jest.fn().mockResolvedValueOnce( {changes: 1} );
      documentDAO.getDocumentByID = jest.fn().mockResolvedValueOnce(exampleDocument);

      const result = await documentController.addDocument(
        exampleDocumentData.title,
        exampleDocumentData.stakeholders,
        exampleDocumentData.scale,
        exampleDocumentData.issuanceDate,
        exampleDocumentData.type,
        exampleDocumentData.description,
        exampleDocumentData.language,
        exampleDocumentData.coordinates,
        exampleDocumentData.pages,
        exampleDocument.pageFrom,
        exampleDocument.pageTo
      );

      expect(result).toBeInstanceOf(Document);
      expect(result).toStrictEqual(exampleDocument);
      expect(documentDAO.addDocument).toHaveBeenCalled();
      expect(documentDAO.addDocument).toHaveBeenCalledWith(
        exampleDocumentData.title,
        exampleDocumentData.scale,
        exampleDocumentData.issuanceDate,
        exampleDocumentData.type,
        exampleDocumentData.description,
        exampleDocumentData.language,
        JSON.stringify(exampleDocumentData.coordinates),
        exampleDocumentData.pages,
        exampleDocumentData.pageFrom,
        exampleDocumentData.pageTo
      );
      expect(documentDAO.getDocumentByID).toHaveBeenCalled();
      expect(documentDAO.getDocumentByID).toHaveBeenCalledWith(exampleAddResult.lastID);
    });

    test("Issuance date after the current date", async () => {
      const exampleDocumentData = {
        title: "title",
        stakeholder: ["stakeholder"],
        scale: "Text",
        issuanceDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        pages: 16,
        pageFrom: null,
        pageTo: null,
        lat: null,
        long: null,
      };

      const result = documentController.addDocument(
        exampleDocumentData.title,
        exampleDocumentData.stakeholders,
        exampleDocumentData.scale,
        exampleDocumentData.issuanceDate,
        exampleDocumentData.type,
        exampleDocumentData.description,
        exampleDocumentData.language,
        exampleDocumentData.pages
      );

      expect(result).rejects.toStrictEqual({ errCode: 400, errMessage: "Date error." });
    });

    test("Invalid Kiruna coordinates", async () => {
      const exampleDocumentData = {
        title: "title",
        stakeholder: ["stakeholder"],
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        pages: 16,
        coordinates: { lat: 68.3, long: 20.3 },
      };

      Utility.isValidKirunaCoordinates = jest.fn().mockReturnValue(false);
      documentDAO.addDocument = jest.fn().mockResolvedValue({ lastID: 2, changes: 1 });

      const result = documentController.addDocument(
        exampleDocumentData.title,
        exampleDocumentData.stakeholders,
        exampleDocumentData.scale,
        exampleDocumentData.issuanceDate,
        exampleDocumentData.type,
        exampleDocumentData.description,
        exampleDocumentData.language,
        exampleDocumentData.pages,
        exampleDocumentData.coordinates
      );

      expect(result).rejects.toStrictEqual({ errCode: 400, errMessage: "Coordinates error." });
    });
  });

  describe("updateDocument", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    test("Document updated successfully", async () => {
      const oldDocumentData = {
        id: 1,
        title: "Document 1",
        stakeholders: ["Stakeholder"],
        scale: 100,
        issuanceDate: "2023-01-01",
        type: "Design",
        language: "English",
        description: "Lorem ipsum...",
        coordinates: { lat: 67.849982, long: 20.217068 },
        pages: 16,
      };

      const oldDocument = new Document(
        oldDocumentData.id,
        oldDocumentData.title,
        oldDocumentData.stakeholders,
        oldDocumentData.scale,
        oldDocumentData.issuanceDate,
        oldDocumentData.type,
        0,
        oldDocumentData.language,
        oldDocumentData.description,
        JSON.stringify(oldDocumentData.coordinates),
        oldDocumentData.pages,
        oldDocumentData.pageFrom,
        oldDocumentData.pageTo
      );

      const documentDAO = new DocumentDAO();
      documentDAO.getDocumentByID = jest.fn().mockResolvedValue(oldDocument);
      Utility.isValidKirunaCoordinates = jest.fn().mockReturnValue(true);
      documentDAO.updateDocument = jest.fn().mockResolvedValue({ changes: 1 });
      documentDAO.deleteStakeholders = jest.fn().mockResolvedValueOnce({ changes: 1 });
      documentDAO.addStakeholder = jest.fn().mockResolvedValueOnce();

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      const result = await expect(
        documentController.updateDocument(
          1,
          "Document 1 Updated",
          ["Stakeholder Updated"],
          200,
          "2023-01-01",
          "Design",
          "Swedish",
          "Loreum ipsum...Updated",
          { lat: 67.849982, long: 20.217068 },
          true,
          16,
          false
        )
      ).resolves.toBeNull();

      expect(documentDAO.getDocumentByID).toHaveBeenCalled();
      expect(documentDAO.getDocumentByID).toHaveBeenCalledWith(1);
      expect(documentDAO.updateDocument).toHaveBeenCalled();
      expect(documentDAO.updateDocument).toHaveBeenCalledWith(
        1,
        "Document 1 Updated",
        200,
        "2023-01-01",
        "Design",
        "Swedish",
        "Loreum ipsum...Updated",
        JSON.stringify({ lat: 67.849982, long: 20.217068 }),
        true,
        16,
        false
      );
    });

    test("Issuance date after the current date", async () => {
      const oldDocumentData = {
        id: 1,
        title: "Document 1",
        stakeholder: "Stakeholder",
        scale: 100,
        issuanceDate: "2023-01-01",
        type: "Design",
        language: "English",
        description: "Lorem ipsum...",
        coordinates: { lat: 67.849982, long: 20.217068 },
        pages: 16,
      };

      const documentDAO = new DocumentDAO();
      documentDAO.getDocumentByID = jest.fn().mockResolvedValue(oldDocumentData);

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      const result = documentController.updateDocument(
        1,
        "Document 1 Updated",
        "Stakeholder Updated",
        200,
        dayjs().add(1, "day").format("YYYY-MM-DD"),
        "Design",
        "Swedish",
        "Loreum ipsum...Updated",
        { lat: 67.849982, long: 20.217068 },
        true,
        16,
        false,
        null,
        false,
        null,
        false
      );

      expect(result).rejects.toEqual({ errCode: 400, errMessage: "Date error." });
    });

    test("Invalid Kiruna Coordinates", async () => {
      const oldDocumentData = {
        id: 2,
        title: "Document 1",
        stakeholder: "Stakeholder",
        scale: 100,
        issuanceDate: "2023-01-01",
        type: "Design",
        language: "English",
        description: "Lorem ipsum...",
        coordinates: { lat: 67.849982, long: 20.217068 },
        pages: 16,
      };

      const documentDAO = new DocumentDAO();
      documentDAO.getDocumentByID = jest.fn().mockResolvedValue(oldDocumentData);
      Utility.isValidKirunaCoordinates = jest.fn().mockReturnValue(false);

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      const result = await expect(
        documentController.updateDocument(
          2,
          "Document 1 Updated",
          "Kiruna kommun",
          200,
          "2023-01-03",
          "Design",
          "Swedish",
          "Loreum ipsum...Updated",
          { lat: 67.849982, long: 20.217068 },
          true,
          16,
          false,
          null,
          false,
          null,
          false
        )
      ).rejects.toEqual({ errCode: 400, errMessage: "Coordinates error." });
    });
  });

  describe("getLinks", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    test("All links retrieved successfully", async () => {
      const exampleLinks = [
        { linkedDocID: 2, title: "Document 2", type: "direct" },
        { linkedDocID: 3, title: "Document 3", type: "indirect" },
      ];
      const documentDAO = new DocumentDAO();
      documentDAO.getDocumentByID = jest.fn().mockResolvedValue({ docID: 1 });
      documentDAO.getLinks = jest.fn().mockResolvedValue(exampleLinks);

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      documentController.getDocumentById = jest.fn().mockResolvedValue({ docID: 1 });
      const result = await documentController.getLinks(1);

      expect(documentDAO.getLinks).toHaveBeenCalled();
      expect(documentDAO.getLinks).toHaveBeenCalledWith(1);
      expect(result).toEqual(exampleLinks);
    });

    test("No links found", async () => {
      const documentDAO = new DocumentDAO();
      documentDAO.getDocumentByID = jest.fn().mockResolvedValue({ docID: 1 });
      documentDAO.getLinks = jest.fn().mockResolvedValue([]);

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      documentController.getDocumentById = jest.fn().mockResolvedValue({ docID: 1 });
      const result = await documentController.getLinks(1);

      expect(documentDAO.getLinks).toHaveBeenCalled();
      expect(documentDAO.getLinks).toHaveBeenCalledWith(1);
      expect(result).toEqual([]);
    });

    test("Document not found", async () => {
      const documentDAO = new DocumentDAO();
      documentDAO.getDocumentByID = jest.fn().mockResolvedValue(undefined);

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      await expect(documentController.getLinks(1)).rejects.toEqual({ errCode: 404, errMessage: "Document not found!" });
    });
  });

  describe("addLink", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    test("Create a new link succesfully", async () => {
      const exampleLink = { id1: 1, id2: 2, type: "direct" };

      const documentDAO = new DocumentDAO();
      documentDAO.getDocumentByID = jest.fn().mockResolvedValue({ docID1: 1, docID2: 2 });
      documentDAO.addLink = jest.fn().mockResolvedValue({ changes: 1 });

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      const result = await documentController.addLink(exampleLink.id1, exampleLink.id2, exampleLink.type);

      expect(documentDAO.addLink).toHaveBeenCalled();
      expect(documentDAO.addLink).toHaveBeenCalledWith(exampleLink.id1, exampleLink.id2, exampleLink.type);
      expect(result).toEqual(exampleLink.id1, exampleLink.id2, exampleLink.type);
    });

    test("Same id error", async () => {
      const exampleLink = { id1: 1, id2: 1, type: "direct" };

      const documentDAO = new DocumentDAO();
      documentDAO.addLink = jest.fn().mockResolvedValue({ changes: 0 });

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      const result = documentController.addLink(exampleLink.id1, exampleLink.id2, exampleLink.type);

      expect(documentDAO.addLink).not.toHaveBeenCalled();
      expect(result).rejects.toEqual({ errCode: 400, errMessage: "Document cannot be linked to itself!" });
    });

    test("Document not found", async () => {
      const exampleLink = { id1: 1, id2: 2, type: "direct" };

      const documentDAO = new DocumentDAO();
      documentDAO.getDocumentByID = jest.fn().mockResolvedValue(undefined);
      documentDAO.addLink = jest.fn().mockResolvedValue({ changes: 0 });

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      await expect(documentController.addLink(exampleLink.id1, exampleLink.id2, exampleLink.type)).rejects.toEqual({
        errCode: 404,
        errMessage: "Document not found!",
      });

      expect(documentDAO.getDocumentByID).toHaveBeenCalled();
      expect(documentDAO.getDocumentByID).toHaveBeenCalledWith(exampleLink.id1);
      expect(documentDAO.getDocumentByID).toHaveBeenCalledWith(exampleLink.id2);
      expect(documentDAO.addLink).not.toHaveBeenCalled();
      //expect(result).rejects.toEqual({ errCode: 404, errMessage: "Document not found!" });
    });

    test("Link already exists", async () => {
      const exampleLink = { id1: 1, id2: 2, type: "direct" };

      const documentDAO = new DocumentDAO();
      documentDAO.getDocumentByID = jest.fn().mockResolvedValue({ docID1: 1, docID2: 2 });
      documentDAO.addLink = jest.fn().mockRejectedValue({ errCode: 409, errMessage: "Link already exists" });

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      await expect(documentController.addLink(exampleLink.id1, exampleLink.id2, exampleLink.type)).rejects.toEqual({
        errCode: 409,
        errMessage: "Link already exists",
      });

      expect(documentDAO.getDocumentByID).toHaveBeenCalled();
      expect(documentDAO.getDocumentByID).toHaveBeenCalledWith(exampleLink.id1);
      expect(documentDAO.getDocumentByID).toHaveBeenCalledWith(exampleLink.id2);
      expect(documentDAO.addLink).toHaveBeenCalled();
      expect(documentDAO.addLink).toHaveBeenCalledWith(exampleLink.id1, exampleLink.id2, exampleLink.type);
    });

    test("No changes in DB", async () => {
      const exampleLink = { id1: 1, id2: 2, type: "direct" };

      const documentDAO = new DocumentDAO();
      documentDAO.getDocumentByID = jest.fn().mockResolvedValue({ docID1: 1, docID2: 2 });
      documentDAO.addLink = jest.fn().mockResolvedValue({ changes: 0 });

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      await expect(documentController.addLink(exampleLink.id1, exampleLink.id2, exampleLink.type)).rejects.toEqual({});

      expect(documentDAO.getDocumentByID).toHaveBeenCalled();
      expect(documentDAO.getDocumentByID).toHaveBeenCalledWith(exampleLink.id1);
      expect(documentDAO.getDocumentByID).toHaveBeenCalledWith(exampleLink.id2);
      expect(documentDAO.addLink).toHaveBeenCalled();
      expect(documentDAO.addLink).toHaveBeenCalledWith(exampleLink.id1, exampleLink.id2, exampleLink.type);
    });
  });

  describe("getAllLinks", () => {
    afterEach(()=>{
      jest.clearAllMocks();
      jest.restoreAllMocks();
    })

    test("All links retrieved successfully", async () => {
      const exampleLinks = [
        { docID1: 1, docID2: 2, type: "Direct" },
        { docID1: 1, docID2: 3, type: "Projection" },
      ]

      const documentDAO = new DocumentDAO();
      documentDAO.getAllLinks = jest.fn().mockResolvedValue(exampleLinks);

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      const result = await documentController.getAllLinks();

      expect(documentDAO.getAllLinks).toHaveBeenCalled();
      expect(result).toEqual(exampleLinks);

    });

    test("No links", async () => {
      const documentDAO = new DocumentDAO();
      documentDAO.getAllLinks = jest.fn().mockResolvedValue([]);

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      const result = await documentController.getAllLinks();

      expect(documentDAO.getAllLinks).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    test("Links not found", async () => {
      const documentDAO = new DocumentDAO();
      documentDAO.getAllLinks = jest.fn().mockResolvedValue(undefined);

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      await expect(documentController.getAllLinks()).rejects.toEqual({ errCode: 404, errMessage: "Links not found!" });
    });
  });
  
});
