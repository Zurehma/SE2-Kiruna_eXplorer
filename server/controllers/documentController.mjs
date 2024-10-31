import dayjs from "dayjs";
import DocumentDAO from "../dao/documentDAO.mjs";
import { isDocumentType } from "../models/document.mjs";

class DocumentController {
  constructor() {
    this.documentDAO = new DocumentDAO();
  }

  getDocuments = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const documents = await this.documentDAO.getDocuments();
        resolve(documents);
      } catch (err) {
        reject(err);
      }
    });
  };

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
   * @param {Number | null} pages
   * @param {Number | null} pages
   * @param {String | null} lat
   * @param {String | null} long
   * @returns {Promise<Document>} A promise that resolves to the newly created object
   */
  addDocument = (
    title,
    stakeholder,
    scale,
    issuanceDate,
    type,
    language,
    description,
    pages = null,
    pageFrom = null,
    pageTo = null,
    lat = null,
    long = null
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (dayjs().isBefore(issuanceDate)) {
          const error = { errCode: 400, errMessage: "Date error!" };
          throw error;
        }

        const documentType = isDocumentType(type);

        if (documentType === undefined) {
          const error = { errCode: 400, errMessage: "Document type error!" };
          throw error;
        }

        let processedPages = pages;
        let processedPageFrom = null;
        let processedPageTo = null;

        if (pageFrom && pageTo) {
          pageFrom <= pageTo ? (processedPageFrom = pageFrom) : (processedPageFrom = pageTo);
          pageFrom <= pageTo ? (processedPageTo = pageTo) : (processedPageTo = pageFrom);
          processedPages = processedPageTo - processedPageFrom;
        }

        const result = await this.documentDAO.addDocument(
          title,
          stakeholder,
          scale,
          issuanceDate,
          documentType,
          language,
          description,
          processedPages,
          processedPageFrom,
          processedPageTo,
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

  addLink = (id1, id2, type) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (id1 === id2) {
          const error = { errCode: 400, errMessage: "Document cannot be linked to itself!" };
          throw error;
        }

        const doc1 = await this.documentDAO.getDocumentByID(id1);
        const doc2 = await this.documentDAO.getDocumentByID(id2);

        if (doc1 === undefined || doc2 === undefined) {
          const error = { errCode: 404, errMessage: "Document not found!" };
          throw error;
        }

        const result = await this.documentDAO.addLink(id1, id2, type);
        if (result.changes === 0) {
          const error = {};
          throw error;
        }
        resolve(id1, id2, type);
      } catch (err) {
        reject(err);
      }
    });
  };
}

export default DocumentController;
