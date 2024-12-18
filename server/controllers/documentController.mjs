import dayjs from "dayjs";
import DocumentDAO from "../dao/documentDAO.mjs";
import Document from "../models/document.mjs";
import Utility from "../utils/utility.mjs";
import GraphConfig from "../ws/graphConfig.mjs";

class DocumentController {
  constructor() {
    this.documentDAO = new DocumentDAO();
  }

  getDocumentById = (id) => {
    return new Promise((resolve, reject) => {
      const fetchDocument = async () => {
        try {
          const document = await this.documentDAO.getDocumentByID(id);

          if (document === undefined) {
            const error = { errCode: 404, errMessage: "Document not found." };
            throw error;
          }

          resolve(document);
        } catch (err) {
          reject(err);
        }
      };
      fetchDocument();
    });
  };

  getDocuments = (pageNo, subtext, type, stakeholder, issuanceDateFrom, issuanceDateTo) => {
    return new Promise((resolve, reject) => {
      const fetchDocuments = async () => {
        try {
          let queryParameters = { subtext, type, stakeholder, issuanceDateFrom, issuanceDateTo };
          const documents = await this.documentDAO.getDocuments(pageNo ? Number(pageNo) : 1, queryParameters);
          resolve(documents);
        } catch (err) {
          reject(err);
        }
      };
      fetchDocuments();
    });
  };

  /**
   * Add a new document with the provided informations
   * @param {String} title
   * @param {Array<String>} stakeholders
   * @param {String | Number} scale
   * @param {String} issuanceDate
   * @param {String} type
   * @param {String} language
   * @param {String} description
   * @param {Object | Array<String> | null} coordinates
   * @param {Number | null} pages
   * @returns {Promise<Document>} A promise that resolves to the newly created object
   */
  addDocument = ({ title, stakeholders, scale, issuanceDate, type, language, description, coordinates, pages }) => {
    return new Promise((resolve, reject) => {
      const addDocument = async () => {
        try {
          if (dayjs().isBefore(issuanceDate)) {
            const error = { errCode: 400, errMessage: "Date error." };
            throw error;
          }

          let validateCoordinates = true;

          if (coordinates && Array.isArray(coordinates)) {
            validateCoordinates = !coordinates.map((c) => Utility.isValidKirunaCoordinates(c[0], c[1])).includes(false);
          } else if (coordinates) {
            validateCoordinates = Utility.isValidKirunaCoordinates(coordinates.lat, coordinates.long);
          }

          if (!validateCoordinates) {
            const error = { errCode: 400, errMessage: "Coordinates error." };
            throw error;
          }

          const result = await this.documentDAO.addDocument(
            title,
            scale,
            issuanceDate,
            type,
            language,
            description,
            coordinates ? JSON.stringify(coordinates) : null,
            pages
          );

          for (let stakeholder of stakeholders) {
            await this.documentDAO.addStakeholder(result.lastID, stakeholder);
          }

          const document = await this.documentDAO.getDocumentByID(result.lastID);

          resolve(document);
        } catch (err) {
          reject(err);
        }
      };
      addDocument();
    });
  };

  /**
   * Update an existing document with the provided informations
   * @param {Number} id
   * @param {String} title
   * @param {Array<String>} stakeholders
   * @param {String | Number} scale
   * @param {String} issuanceDate
   * @param {String} type
   * @param {String} language
   * @param {String} description
   * @param {Object | Array<String> | null} coordinates
   * @param {Number | null} pages
   * @returns {Promise<null>} A promise that resolves to null
   */
  updateDocument = ({ id, title, stakeholders, scale, issuanceDate, type, language, description, coordinates, pages }) => {
    return new Promise((resolve, reject) => {
      const updateDocument = async () => {
        try {
          if (dayjs().isBefore(issuanceDate)) {
            const error = { errCode: 400, errMessage: "Date error." };
            throw error;
          }

          if (coordinates && Array.isArray(coordinates)) {
            coordinates.forEach((c) => {
              if (!Utility.isValidKirunaCoordinates(c[0], c[1])) {
                const error = { errCode: 400, errMessage: "Coordinates error." };
                throw error;
              }
            });
          } else if (coordinates && !Utility.isValidKirunaCoordinates(coordinates.lat, coordinates.long)) {
            const error = { errCode: 400, errMessage: "Coordinates error." };
            throw error;
          }

          const oldDocument = await this.documentDAO.getDocumentByID(id);

          if (oldDocument == undefined) {
            const error = { errCode: 404, errMessage: "Document not found." };
            throw error;
          }

          await this.documentDAO.updateDocument(
            id,
            title,
            scale,
            issuanceDate,
            type,
            language,
            description,
            coordinates ? JSON.stringify(coordinates) : null,
            pages
          );

          await this.documentDAO.deleteStakeholders(id);

          for (let stakeholder of stakeholders) {
            await this.documentDAO.addStakeholder(id, stakeholder);
          }

          if (oldDocument.scale !== scale || oldDocument.issuanceDate !== issuanceDate) {
            await GraphConfig.removeGraphConfiguration(GraphConfig.ELEMENT_TYPES.nodes, id);
          }

          resolve(null);
        } catch (err) {
          reject(err);
        }
      };
      updateDocument();
    });
  };

  deleteDocument = (id) => {
    return new Promise((resolve, reject) => {
      const deleteDocument = async () => {
        try {
          const links = await this.documentDAO.getLinks(id);
          let deletedDoc = await this.documentDAO.deleteDocument(id);

          if (deletedDoc === 0) {
            const error = { errCode: 404, errMessage: "Document not found!" };
            throw error;
          }

          await GraphConfig.removeGraphConfiguration(GraphConfig.ELEMENT_TYPES.nodes, id);

          for (let link of links) {
            await GraphConfig.removeGraphConfiguration(GraphConfig.ELEMENT_TYPES.connections, link.linkID);
          }

          resolve(null);
        } catch (err) {
          reject(err);
        }
      };
      deleteDocument();
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
    return new Promise((resolve, reject) => {
      const getLinks = async () => {
        try {
          const doc = await this.documentDAO.getDocumentByID(id1);

          if (doc === undefined) {
            const error = { errCode: 404, errMessage: "Document not found!" };
            throw error;
          }

          const links = await this.documentDAO.getLinks(id1);
          resolve(links);
        } catch (err) {
          reject(err);
        }
      };
      getLinks();
    });
  };

  addLink = (id1, id2, type) => {
    return new Promise((resolve, reject) => {
      const addLink = async () => {
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
      };
      addLink();
    });
  };

  getAllLinks = () => {
    return new Promise((resolve, reject) => {
      const getAllLinks = async () => {
        try {
          const links = await this.documentDAO.getAllLinks();
          if (links === undefined) {
            const error = { errCode: 404, errMessage: "Links not found!" };
            throw error;
          }
          resolve(links);
        } catch (err) {
          reject(err);
        }
      };
      getAllLinks();
    });
  };

  deleteLink = (linkID) => {
    return new Promise((resolve, reject) => {
      const deleteLink = async () => {
        try {
          let deletedLink = await this.documentDAO.deleteLink(linkID);

          if (deletedLink === 0) {
            const error = { errCode: 404, errMessage: "Link not found!" };
            throw error;
          }

          await GraphConfig.removeGraphConfiguration(GraphConfig.ELEMENT_TYPES.connections, linkID);

          resolve(null);
        } catch (err) {
          reject(err);
        }
      };
      deleteLink();
    });
  };
}

export default DocumentController;
