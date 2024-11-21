import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import AttachmentController from "../../../controllers/attachmentController.mjs";
import AttachmentDAO from "../../../dao/attachmentDAO.mjs";
import AttachmentInfo from "../../../models/attachmentInfo.mjs";
import DocumentDAO from "../../../dao/documentDAO.mjs";
import Storage from "../../../utils/storage.mjs";
import path from "path";

jest.mock("../../../dao/attachmentDAO.mjs");
jest.mock("../../../dao/documentDAO.mjs");

describe("AttachmentController", () => {

    describe("getAttachments", () => {
        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test("Return array of attachment info objects", async () => {
            const attachment1 = {id: 1, docID: 1, name: "test", path: "test", format: "test"};
            const attachment2 = {id: 2, docID: 1, name: "test", path: "test", format: "test"};

            const documentDAO = new DocumentDAO();
            documentDAO.getDocumentByID = jest.fn().mockResolvedValue({docID: 1});

            const attachmentDAO = new AttachmentDAO();
            attachmentDAO.getAttachmentsByDocumentID = jest.fn().mockResolvedValue([attachment1, attachment2]);

            const attachmentController = new AttachmentController();
            attachmentController.attachmentDAO = attachmentDAO;
            attachmentController.documentDAO = documentDAO; 

            const result = await attachmentController.getAttachments(1);

            expect(result).toEqual([attachment1, attachment2]);
        });

        test("Return error when document is not found", async () => {
            const documentDAO = new DocumentDAO();
            documentDAO.getDocumentByID = jest.fn().mockResolvedValue(undefined);

            const attachmentController = new AttachmentController();
            attachmentController.documentDAO = documentDAO;

            await expect(attachmentController.getAttachments(1)).rejects.toEqual({ errCode: 404, errMessage: "Document not found." });
        });

        test("Return empty array when no attachments are found", async () => {
            const documentDAO = new DocumentDAO();
            documentDAO.getDocumentByID = jest.fn().mockResolvedValue({docID: 1});

            const attachmentDAO = new AttachmentDAO();
            attachmentDAO.getAttachmentsByDocumentID = jest.fn().mockResolvedValue([]);

            const attachmentController = new AttachmentController();
            attachmentController.attachmentDAO = attachmentDAO;
            attachmentController.documentDAO = documentDAO;

            const result = await attachmentController.getAttachments(1);

            expect(result).toEqual([]);
        });
    });

    describe("addAttachment", () => {

        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test("Succesfully add attachment", async() => {
            const exampleAttachmentData = {id: 1, docID: 1, name: "test", path: "test", format: "test"};
            const exampleAttachment = new AttachmentInfo(exampleAttachmentData);
            const addResult = {changes: 1, lastID: 1};

            const documentDAO = new DocumentDAO();
            documentDAO.getDocumentByID = jest.fn().mockResolvedValue({docID: 1});

            //mock file storage
            const fileInfo = {originalname: "test", path: "test", mimetype: "test"};
            Storage.saveFile = jest.fn().mockResolvedValue(fileInfo);

            const attachmentDAO = new AttachmentDAO();
            attachmentDAO.addAttachment = jest.fn().mockResolvedValue(addResult);
            attachmentDAO.getAttachmentByID = jest.fn().mockResolvedValue(exampleAttachment);

            const attachmentController = new AttachmentController();
            attachmentController.attachmentDAO = attachmentDAO;
            attachmentController.documentDAO = documentDAO;

            const result = await attachmentController.addAttachment({}, 1);

            expect(result).toEqual(exampleAttachment);

        });

        test("Return error when document is not found", async () => {
            const documentDAO = new DocumentDAO();
            documentDAO.getDocumentByID = jest.fn().mockResolvedValue(undefined);

            const attachmentController = new AttachmentController();
            attachmentController.documentDAO = documentDAO;

            await expect(attachmentController.addAttachment({}, 1)).rejects.toEqual({ errCode: 404, errMessage: "Document not found." });
        });

    });

    describe("getAttachmentByID", () => {
        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test("Return attachment info object", async () => {
            const attachment = {id: 1, docID: 1, name: "test", path: "test", format: "test"};

            const attachmentDAO = new AttachmentDAO();
            attachmentDAO.getAttachmentByID = jest.fn().mockResolvedValue(attachment);

            const attachmentController = new AttachmentController();
            attachmentController.attachmentDAO = attachmentDAO;

            const result = await attachmentController.getAttachment(1,1);

            expect(result).toEqual(attachment);
        });

        test("Return error when attachment is not found", async () => {
            const attachmentDAO = new AttachmentDAO();
            attachmentDAO.getAttachmentByID = jest.fn().mockResolvedValue(undefined);

            const attachmentController = new AttachmentController();
            attachmentController.attachmentDAO = attachmentDAO;

            await expect(attachmentController.getAttachment(1,1)).rejects.toEqual({ errCode: 404, errMessage: "Attachment not found." });

        });

        test("Return error when document id does not match document id in attachment", async () => {
            const attachment = {id: 1, docID: 2, name: "test", path: "test", format: "test"};

            const attachmentDAO = new AttachmentDAO();
            attachmentDAO.getAttachmentByID = jest.fn().mockResolvedValue(attachment);

            const attachmentController = new AttachmentController();
            attachmentController.attachmentDAO = attachmentDAO;

            await expect(attachmentController.getAttachment(1,1)).rejects.toEqual({ errCode: 400, errMessage: "Attachment not linked with the document provided." });

        });
    });

    describe("deleteAttachment", () => {
        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test("Succesfully delete attachment", async () => {
            const attachment = {id: 1, docID: 1, name: "test", path: "test", format: "test"};

            const attachmentDAO = new AttachmentDAO();
            attachmentDAO.getAttachmentByID = jest.fn().mockResolvedValue(attachment);

            const attachmentController = new AttachmentController();
            attachmentController.attachmentDAO = attachmentDAO;
            Storage.deleteFile = jest.fn();

            const result = await attachmentController.deleteAttachment(1,1);

            expect(result).toBeNull();
        });

        test("Return error when attachment is not found", async () => {
            const attachmentDAO = new AttachmentDAO();
            attachmentDAO.getAttachmentByID = jest.fn().mockResolvedValue(undefined);

            const attachmentController = new AttachmentController();
            attachmentController.attachmentDAO = attachmentDAO;

            await expect(attachmentController.deleteAttachment(1,1)).rejects.toEqual({ errCode: 404, errMessage: "Attachment not found." });

        });

        test("Return error when document id does not match document id in attachment", async () => {
            const attachment = {id: 1, docID: 2, name: "test", path: "test", format: "test"};

            const attachmentDAO = new AttachmentDAO();
            attachmentDAO.getAttachmentByID = jest.fn().mockResolvedValue(attachment);

            const attachmentController = new AttachmentController();
            attachmentController.attachmentDAO = attachmentDAO;

            await expect(attachmentController.deleteAttachment(1,1)).rejects.toEqual({ errCode: 400, errMessage: "Attachment not linked with the document provided." });

        });

    });

});