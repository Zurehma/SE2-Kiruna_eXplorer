import dayjs from "dayjs";
import DocumentDAO from "../dao/DocumentoDAO.mjs";
import { isDocumentType } from "../models/document.mjs";

class DocumentController {
  constructor() {
    this.documentDAO = new DocumentDAO();
  }

  getDocuments = () => {};

  /**
   * Add a new document with the provided information
   * @param {String} title
   * @param {String} stakeholder
   * @param {Number} scale
   * @param {String} issuanceDate
   * @param {String} type
   * @param {String} language
   * @param {String} description
   * @param {Number | null} pages
   * @param {String | null} lat
   * @param {String | null} long
   * @returns {Promise<Document>} A promise that resolves to the newly created object
   */
  addDocument = (title, stakeholder, scale, issuanceDate, type, language, description, pages = null, lat = null, long = null) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (dayjs().isBefore(issuanceDate)) {
          const error = { errCode: 400, errMessage: "Date error!" };
          throw error;
        }

        const documentType = isDocumentType(type);
        console.log(documentType);

        if (documentType === undefined) {
          const error = { errCode: 400, errMessage: "Document type error!" };
          throw error;
        }

        const result = await this.documentDAO.addDocument(
          title,
          stakeholder,
          scale,
          issuanceDate,
          documentType,
          language,
          description,
          pages,
          lat,
          long
        );

        if (result.changes === 0) {
          const error = {};
          throw error;
        }

        const document = await this.documentDAO.getDocumentByID(result.lastID);

        resolve(document);
      } catch (err) {
        reject(err);
      }
    });
  };

  addLink = () => {};
}

export default DocumentController;
