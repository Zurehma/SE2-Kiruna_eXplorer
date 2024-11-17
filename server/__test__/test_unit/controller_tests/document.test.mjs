import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import DocumentController from "../../../controllers/documentController.mjs";
import Document from "../../../models/document.mjs";
import DocumentDAO from "../../../dao/documentDAO.mjs";
import dayjs from "dayjs";

jest.mock("../../../dao/documentDAO");

describe("DocumentController", () => {
    describe("getDocument", () => {
      /**
       * @type {DocumentController}
       */
      let documentController;
      let documentDAO;

      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
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
        let queryParameter = { type: null, stakeholder: null, issuanceDateFrom: null, issuanceDateTo: null};
        
        jest.spyOn(documentDAO, "getDocuments").mockResolvedValue(exampleDocumentData);
        let response = await documentController.getDocuments(null, null, null, null);
  
        // { type: "Informative", stakeholder: "stakeholder", issuanceDateFrom: '2010-10-10', issuanceDateTo: '2020-10-10'}
        expect(documentDAO.getDocuments).toHaveBeenCalled();
        expect(documentDAO.getDocuments).toHaveBeenCalledWith(queryParameter);

        expect(response).toBe(exampleDocumentData);
      });
  
      test("Wrong document type", async () => {
        const result = documentController.addDocument(
          exampleDocumentData.title,
          exampleDocumentData.stakeholder,
          exampleDocumentData.scale,
          exampleDocumentData.issuanceDate,
          exampleDocumentData.type,
          exampleDocumentData.description,
          exampleDocumentData.language,
          exampleDocumentData.pages
        );
  
        expect(result).rejects.toStrictEqual({ errCode: 400, errMessage: "Document type error!" });
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
      const exampleAddResult = { lastID: 2, changes: 1 };
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        coordinates: {"lat": 67.8603,"long": 20.2251},
        pages: 16
      };
      const exampleDocument = new Document(
        exampleAddResult.lastID,
        exampleDocumentData.title,
        exampleDocumentData.stakeholder,
        exampleDocumentData.scale,
        exampleDocumentData.issuanceDate,
        exampleDocumentData.type,
        0,
        exampleDocumentData.language,
        exampleDocumentData.description,
        exampleDocumentData.coordinates,
        exampleDocumentData.pages,
        exampleDocumentData.pageFrom,
        exampleDocumentData.pageTo,
      );

      documentDAO.addDocument = jest.fn().mockResolvedValueOnce(exampleAddResult);
      documentDAO.getDocumentByID = jest.fn().mockResolvedValueOnce(exampleDocument);

      const result = await documentController.addDocument(
        exampleDocumentData.title,
        exampleDocumentData.stakeholder,
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
        exampleDocumentData.stakeholder,
        exampleDocumentData.scale,
        exampleDocumentData.issuanceDate,
        exampleDocumentData.type,
        exampleDocumentData.description,
        exampleDocumentData.language,
        exampleDocumentData.coordinates,
        exampleDocumentData.pages,
        exampleDocumentData.pageFrom,
        exampleDocumentData.pageTo,
      );
      expect(documentDAO.getDocumentByID).toHaveBeenCalled();
      expect(documentDAO.getDocumentByID).toHaveBeenCalledWith(exampleAddResult.lastID);
    });

    test("Issuance date after the current date", async () => {
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
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
        exampleDocumentData.stakeholder,
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
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        pages: 16,
        coordinates: {lat: 100.1 , long: 100.1}
      };


    });

    test("Insert failed", async () => {
      const exampleAddResult = { lastID: 2, changes: 0 };
      const exampleDocumentData = {
        title: "title",
        stakeholder: "stakeholder",
        scale: 100,
        issuanceDate: "2024-02-12",
        type: "Informative",
        language: "English",
        description: "Lore ipsum...",
        pages: 16,
        coordinates: { lat: 67.8603, long: 20.2251},
      };

      documentDAO.addDocument = jest.fn().mockResolvedValueOnce(exampleAddResult);

      const result = documentController.addDocument(
        exampleDocumentData.title,
        exampleDocumentData.stakeholder,
        exampleDocumentData.scale,
        exampleDocumentData.issuanceDate,
        exampleDocumentData.type,
        exampleDocumentData.description,
        exampleDocumentData.language,
        exampleDocumentData.pages,
      );

      expect(result).rejects.toStrictEqual({});
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
});
