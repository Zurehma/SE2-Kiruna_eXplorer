import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";
import AttachmentDAO from "../../../dao/attachmentDAO.mjs"; 
import db from "../../../db/db.mjs";
import AttachmentInfo from "../../../models/attachmentInfo.mjs";

jest.mock("../../../db/db.mjs");

/**
 * @type {AttachmentDAO}
 */
let attachmentDAO;

const mapRowsToAttachmentInfo = (rows) => {
    return rows.map((row) => new AttachmentInfo(row.id, row.docID, row.name, row.path, row.format));
}

describe("AttachmentDAO", () => {

    describe("addAttachment", () => {
        beforeEach(() => {
            attachmentDAO = new AttachmentDAO();
        });

        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test("Successfully add new attachment", async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback.call({ changes:1, lastID:0 }, null);
              });

            const result = await attachmentDAO.addAttachment(1, "name", "path", "format");
            
            expect(result.changes).toBe(1);
            expect(result.lastID).toBeGreaterThanOrEqual(0);
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });

        test("Error adding new attachment", async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback.call({ changes:0, lastID:0 }, new Error("Error"));
            });

            await expect(attachmentDAO.addAttachment(1, "name", "path", "format")).rejects.toThrow("Error");
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });
    });

    describe("getAttachmentsByDocumentID", () => {
        beforeEach(() => {
            attachmentDAO = new AttachmentDAO();
        });

        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test("Successfully get attachments by document ID", async () => {
            const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback.call(null, null, [{ id: 1, docID: 1, name: "name", path: "path", format: "format" }]);
            });

            const result = await attachmentDAO.getAttachmentsByDocumentID(1);
            
            expect(result.length).toBe(1);
            expect(result[0]).toBeInstanceOf(AttachmentInfo);
            expect(mockDBAll).toHaveBeenCalledTimes(1);
        });

        test("Error getting attachments by document ID", async () => {
            const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback.call(null, new Error("Error"), null);
            });

            await expect(attachmentDAO.getAttachmentsByDocumentID(1)).rejects.toThrow("Error");
            expect(mockDBAll).toHaveBeenCalledTimes(1);
        });
    });

    describe("getAttachmentByID", () => {
        beforeEach(() => {
            attachmentDAO = new AttachmentDAO();
        });

        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test("Successfully get attachment by ID", async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback.call(null, null, { id: 1, docID: 1, name: "name", path: "path", format: "format" });
            });

            const result = await attachmentDAO.getAttachmentByID(1);
            
            expect(result).toBeInstanceOf(AttachmentInfo);
            expect(mockDBGet).toHaveBeenCalledTimes(1);
        });

        test("Attachment not found", async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback.call(null, null, undefined);
            });

            const result = await attachmentDAO.getAttachmentByID(1);
            
            expect(result).toBeUndefined();
            expect(mockDBGet).toHaveBeenCalledTimes(1);
        });

        test("Error getting attachment by ID", async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
                callback.call(null, new Error("Error"), null);
            });

            await expect(attachmentDAO.getAttachmentByID(1)).rejects.toThrow("Error");
            expect(mockDBGet).toHaveBeenCalledTimes(1);
        });
    });

    describe("deleteAttachmentByID", () => {
        beforeEach(() => {
            attachmentDAO = new AttachmentDAO();
        });

        afterEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        test("Successfully delete attachment by ID", async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback.call({ changes:1, lastID:0 }, null);
              });

            const result = await attachmentDAO.deleteAttachmentByID(1);
            
            expect(result.changes).toBe(1);
            expect(result.lastID).toBe(0);
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });

        test("Error deleting attachment by ID", async () => {
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback.call({ changes:0, lastID:0 }, new Error("Error"));
            });

            await expect(attachmentDAO.deleteAttachmentByID(1)).rejects.toThrow("Error");
            expect(mockDBRun).toHaveBeenCalledTimes(1);
        });
    });

});

