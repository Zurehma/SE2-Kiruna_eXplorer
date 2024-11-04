import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import DocumentController from "../../../controllers/documentController.mjs";
import Document from "../../../models/document.mjs";
import DocumentDao from "../../../dao/documentDAO.mjs";

jest.mock("../../../dao/documentDAO.mjs");

describe("documentController", () => {

  
  describe("addLink", () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    test("Create a new link succesfully", async () => {
      const exampleLink = {id1: 1, id2: 2, type: "direct"};

      const documentDAO = new DocumentDao();
      documentDAO.addLink = jest.fn().mockResolvedValue({changes: 1});

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      const result = await documentController.addLink(exampleLink.id1, exampleLink.id2, exampleLink.type);

      expect(documentDAO.addLink).toHaveBeenCalled();
      expect(documentDAO.addLink).toHaveBeenCalledWith(exampleLink.id1, exampleLink.id2, exampleLink.type);
      expect(result).toEqual(exampleLink.id1, exampleLink.id2, exampleLink.type);
    });

    test("Same id error", async () => {
      const exampleLink = {id1: 1, id2: 1, type: "direct"};

      const documentDAO = new DocumentDao();
      documentDAO.addLink = jest.fn().mockResolvedValue({changes: 0});

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      const result = documentController.addLink(exampleLink.id1, exampleLink.id2, exampleLink.type);

      expect(documentDAO.addLink).not.toHaveBeenCalled();
      expect(result).rejects.toEqual({ errCode: 400, errMessage: "Document cannot be linked to itself!" });
    });

    test("Link type error", async () => {
      const exampleLink = {id1: 1, id2: 2, type: "wrong"};
      
      const documentDAO = new DocumentDao();
      documentDAO.addLink = jest.fn().mockResolvedValue({changes: 0});

      const documentController = new DocumentController();
      documentController.documentDAO = documentDAO;
      const result = documentController.addLink(exampleLink.id1, exampleLink.id2, exampleLink.type);

      expect(documentDAO.addLink).not.toHaveBeenCalled();
      expect(result).rejects.toEqual({ errCode: 400, errMessage: "Link type error!" });
    });

    test("Document not found", async () => {
      const exampleLink = {id1: 1, id2: 2, type: "direct"};

      const documentDAO = new DocumentDao();
      documentDAO.getDocumentByID = jest.fn().mockResolvedValue(undefined);
      documentDAO.addLink = jest.fn().mockResolvedValue({changes: 0});

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
      const exampleLink = {id1: 1, id2: 2, type: "direct"};

      const documentDAO = new DocumentDao();
      documentDAO.getDocumentByID = jest.fn().mockResolvedValue({docID1: 1, docID2: 2});
      documentDAO.addLink = jest.fn().mockRejectedValue({errCode: 409, errMessage: "Link already exists"});

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
      const exampleLink = {id1: 1, id2: 2, type: "direct"};

      const documentDAO = new DocumentDao();
      documentDAO.getDocumentByID = jest.fn().mockResolvedValue({docID1: 1, docID2: 2});
      documentDAO.addLink = jest.fn().mockResolvedValue({changes: 0});

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
