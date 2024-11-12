import dayjs from "dayjs";
import DocumentDAO from "../dao/documentDAO.mjs";
import { getLinkTypes, isLinkType } from "../models/document.mjs";
import Document from "../models/document.mjs";

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
  addDocument = (
    title,
    stakeholder,
    scale,
    issuanceDate,
    type,
    language,
    description,
    coordinates = null,
    pages = null,
    pageFrom = null,
    pageTo = null
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (dayjs().isBefore(issuanceDate)) {
          const error = { errCode: 400, errMessage: "Date error." };
          throw error;
        }

        // TODO: validate kiruna coordinates

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

  updateDocument = (
    id,
    title,
    stakeholder,
    scale,
    issuanceDate,
    type,
    language,
    description,
    coordinates = null,
    pages = null,
    pageFrom = null,
    pageTo = null
  ) => {
    try {
      if (dayjs().isBefore(issuanceDate)) {
        const error = { errCode: 400, errMessage: "Date error." };
        throw error;
      }

      // TODO: validate kiruna coordinates
    } catch (err) {
      reject(err);
    }
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

        const linkType = isLinkType(type);

        if (linkType === undefined) {
          const error = { errCode: 400, errMessage: "Link type error!" };
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
