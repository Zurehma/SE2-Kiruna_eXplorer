import dayjs from "dayjs";
import DocumentDAO from "../dao/documentDAO.mjs";
//import { getLinkTypes, isLinkType } from "../models/document.mjs";
import Document from "../models/document.mjs";
import Utility from "../utils/utility.mjs";

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

  getDocumentById = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const document = await this.documentDAO.getDocumentByID(id);
        resolve(document);
      } catch (err) {
        reject(err);
      }
    });
  };

  filterDocuments = (type, stakeholder, issuanceDateFrom, issuanceDateTo) => {  
    return new Promise(async (resolve, reject) => {
      try {
        let queryParameter = { type, stakeholder, issuanceDateFrom, issuanceDateTo };
        const documents = await this.documentDAO.filterDocuments(queryParameter);
        resolve(documents);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Add a new document with the provided informations
   * @param {String} title
   * @param {String} stakeholder
   * @param {String | Number} scale
   * @param {String} issuanceDate
   * @param {String} type
   * @param {String} language
   * @param {String} description
   * @param {Object | null} coordinates
   * @param {Number | null} pages
   * @param {Number | null} pages
   * @param {Number | null} pages
   * @returns {Promise<Document>} A promise that resolves to the newly created object
   */
  addDocument = (title, stakeholder, scale, issuanceDate, type, language, description, coordinates, pages, pageFrom, pageTo) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (dayjs().isBefore(issuanceDate)) {
          const error = { errCode: 400, errMessage: "Date error." };
          throw error;
        }

        if (coordinates && !Utility.isValidKirunaCoordinates(coordinates.lat, coordinates.long)) {
          const error = { errCode: 400, errMessage: "Coordinates error." };
          throw error;
        }

        const result = await this.documentDAO.addDocument(
          title,
          stakeholder,
          scale,
          issuanceDate,
          type,
          language,
          description,
          coordinates ? JSON.stringify(coordinates) : null,
          pages,
          pageFrom,
          pageTo
        );

        const document = await this.documentDAO.getDocumentByID(result.lastID);

        resolve(document);
      } catch (err) {
        reject(err);
      }
    });
  };

  /**
   * Update an existing document with the provided informations
   * @param {Number} id
   * @param {String || null} title
   * @param {String || null} stakeholder
   * @param {String || Number || null} scale
   * @param {String || null} issuanceDate
   * @param {String || null} type
   * @param {String || null} language
   * @param {String || null} description
   * @param {Object || null} coordinates
   * @param {Boolean} isCoordinatesPresent
   * @param {Number || null} pages
   * @param {Boolean} isPagesPresent
   * @param {Number || null} pageFrom
   * @param {Boolean} isPageFromPresent
   * @param {Number || null} pageTo
   * @param {Boolean} isPageToPresent
   * @returns {Promise<null>} A promise that resolves to null
   */
  updateDocument = (
    id,
    title,
    stakeholder,
    scale,
    issuanceDate,
    type,
    language,
    description,
    coordinates,
    isCoordinatesPresent,
    pages,
    isPagesPresent,
    pageFrom,
    isPageFromPresent,
    pageTo,
    isPageToPresent
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (dayjs().isBefore(issuanceDate)) {
          const error = { errCode: 400, errMessage: "Date error." };
          throw error;
        }

        if (coordinates && !Utility.isValidKirunaCoordinates(coordinates.lat, coordinates.long)) {
          const error = { errCode: 400, errMessage: "Coordinates error." };
          throw error;
        }

        const oldDocument = await this.documentDAO.getDocumentByID(id);

        if (oldDocument == undefined) {
          const error = { errCode: 404, errMessage: "Document not found." };
          throw error;
        }

        let processedCoordinates = null;

        if (isCoordinatesPresent && coordinates) {
          processedCoordinates = JSON.stringify(coordinates);
        } else if (oldDocument.coordinates) {
          processedCoordinates = JSON.stringify(oldDocument.coordinates);
        }

        let processedPages = null;

        if (isPagesPresent && pages) {
          processedPages = pages;
        } else {
          processedPages = oldDocument.pages;
        }

        let processedPageFrom = null;

        if (isPageFromPresent && pageFrom) {
          processedPageFrom = pageFrom;
        } else {
          processedPageFrom = oldDocument.pageFrom;
        }

        let processedPageTo = null;

        if (isPageToPresent && pageTo) {
          processedPageTo = pageTo;
        } else {
          processedPageTo = oldDocument.pageTo;
        }

        await this.documentDAO.updateDocument(
          id,
          title || oldDocument.title,
          stakeholder || oldDocument.stakeholder,
          scale || oldDocument.scale,
          issuanceDate || oldDocument.issuanceDate,
          type || oldDocument.type,
          language || oldDocument.language,
          description || oldDocument.description,
          processedCoordinates,
          processedPages,
          processedPageFrom,
          processedPageTo
        );

        resolve(null);
      } catch (err) {
        reject(err);
      }
    });
  };

  /**
   * Get the list of already available document types
   * @returns {Promise<Array<String>>} A promise that resolves to an array of strings
   */
  getDocumentTypes = () => this.documentDAO.getDocumentTypes();

  /**
   * Get the list of already available stakeholders
   * @returns {Promise<Array<String>>} A promise that resolves to an array of strings
   */
  getStakeholders = () => this.documentDAO.getStakeholders();

  /**
   * Get the list of already available link types
   * @returns {Promise<Array<String>>} A promise that resolves to an array of strings
   */
  getLinkTypes = () => this.documentDAO.getLinkTypes();

  /**
   * Get all links of a documents given its ID
   * @param {Number} id1
   * @returns
   */
  getLinks = (id1) => {
    return new Promise(async (resolve, reject) => {
      try {
        const links = await this.documentDAO.getLinks(id1);
        resolve(links);
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

        const existingLinks = await this.documentDAO.getLinks(id1);
        if (existingLinks.some((link) => link.id2 === id2 && link.type === type)) {
          const error = { errCode: 409, errMessage: "Link already exists!" };
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
