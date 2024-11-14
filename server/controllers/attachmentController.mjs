import DocumentDAO from "../dao/documentDAO.mjs";
import AttachmentDAO from "../dao/attachmentDAO.mjs";
import Storage from "../utils/storage.mjs";
import path from "path";
import AttachmentInfo from "../models/attachmentInfo.mjs";

class AttachmentController {
  constructor() {
    this.documentDAO = new DocumentDAO();
    this.attachmentDAO = new AttachmentDAO();
  }

  /**
   * Get all the attachments associated with the document
   * @param {Number} docID
   * @returns {Promise<Array<AttachmentInfo>>} A promise that resolves to an array of attachment info objects
   */
  getAttachments = (docID) => {
    return new Promise(async (resolve, reject) => {
      try {
        const document = await this.documentDAO.getDocumentByID(docID);

        if (document == undefined) {
          const error = { errCode: 404, errMessage: "Document not found." };
          throw error;
        }

        const attachment = await this.attachmentDAO.getAttachmentsByDocumentID(docID);

        resolve(attachment);
      } catch (err) {
        reject(err);
      }
    });
  };

  /**
   * Add a new attachment to an existing document
   * @param {*} req
   * @param {Number} docID
   * @returns {Promise<AttachmentInfo>} A promise that resolves to the newly created object
   */
  addAttachment = (req, docID) => {
    return new Promise(async (resolve, reject) => {
      try {
        const document = await this.documentDAO.getDocumentByID(docID);

        if (document == undefined) {
          const error = { errCode: 404, errMessage: "Document not found." };
          throw error;
        }

        const fileInfo = await Storage.saveFile(req);
        const result = await this.attachmentDAO.addAttachment(docID, fileInfo.originalname, path.join(".", fileInfo.path), fileInfo.mimetype);
        const attachment = await this.attachmentDAO.getAttachmentByID(result.lastID);

        resolve(attachment);
      } catch (err) {
        reject(err);
      }
    });
  };

  /**
   * Get one attachment associated with the document
   * @param {Number} docID
   * @param {Number} attachmentID
   * @returns {Promise<AttachmentInfo>} A promise that resolves to an attachment info object
   */
  getAttachment = (docID, attachmentID) => {
    return new Promise(async (resolve, reject) => {
      try {
        const attachment = await this.attachmentDAO.getAttachmentByID(attachmentID);

        if (attachment == undefined) {
          const error = { errCode: 404, errMessage: "Attachment not found." };
          throw error;
        } else if (attachment.docID !== docID) {
          const error = { errCode: 400, errMessage: "Attachment not linked with the document provided." };
          throw error;
        }

        resolve(attachment);
      } catch (err) {
        reject(err);
      }
    });
  };

  /**
   * Delete an attachment of a document by its ID
   * @param {Number} docID
   * @param {Number} attachmentID
   * @returns {Promise<>} A promise that resolves to nothing
   */
  deleteAttachment = (docID, attachmentID) => {
    return new Promise(async (resolve, reject) => {
      try {
        const attachment = await this.attachmentDAO.getAttachmentByID(attachmentID);

        if (attachment == undefined) {
          const error = { errCode: 404, errMessage: "Attachment not found." };
          throw error;
        } else if (attachment.docID !== docID) {
          const error = { errCode: 400, errMessage: "Attachment not linked with the document provided." };
          throw error;
        }

        Storage.deleteFile(attachment.path);
        await this.attachmentDAO.deleteAttachmentByID(attachmentID);

        resolve(null);
      } catch (err) {
        reject(err);
      }
    });
  };
}

export default AttachmentController;
