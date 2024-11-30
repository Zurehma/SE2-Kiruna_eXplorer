import dayjs from "dayjs";
import DocumentDAO from "../dao/documentDAO.mjs";
import Document from "../models/document.mjs";
import Utility from "../utils/utility.mjs";

class DocumentController {
  constructor() {
    this.documentDAO = new DocumentDAO();
  }

  getDocumentById = (id) => {
    return new Promise(async (resolve, reject) => {
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
    });
  };

  getDocuments = (type, stakeholder, issuanceDateFrom, issuanceDateTo, limit, offset) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryParameter = { type, stakeholder, issuanceDateFrom, issuanceDateTo };
        const documents = await this.documentDAO.getDocuments(queryParameter, limit, offset);
        resolve(documents);
      } catch (err) {
        reject(err);
      }
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
   * @param {Array<String> | null} coordinates
   * @param {Number | null} pages
   * @param {Number | null} pages
   * @param {Number | null} pages
   * @returns {Promise<Document>} A promise that resolves to the newly created object
   */
  addDocument = (title, stakeholders, scale, issuanceDate, type, language, description, coordinates, pages, pageFrom, pageTo) => {
    return new Promise(async (resolve, reject) => {
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

        const result = await this.documentDAO.addDocument(
          title,
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

        for (let stakeholder of stakeholders) {
          await this.documentDAO.addStakeholder(result.lastID, stakeholder);
        }

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
   * @param {String} title
   * @param {Array<String>} stakeholders
   * @param {String | Number} scale
   * @param {String} issuanceDate
   * @param {String} type
   * @param {String} language
   * @param {String} description
   * @param {Array<String> | null} coordinates
   * @param {Number | null} pages
   * @param {Number | null} pageFrom
   * @param {Number | null} pageTo
   * @returns {Promise<null>} A promise that resolves to null
   */
  updateDocument = (id, title, stakeholders, scale, issuanceDate, type, language, description, coordinates, pages, pageFrom, pageTo) => {
    return new Promise(async (resolve, reject) => {
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
          pages,
          pageFrom,
          pageTo
        );

        await this.documentDAO.deleteStakeholders(id);

        for (let stakeholder of stakeholders) {
          await this.documentDAO.addStakeholder(id, stakeholder);
        }

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
    });
  };

  addLink = (id1, id2, type) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(id1, id2, type);
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

  getAllExistingLinks = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const links = await this.documentDAO.getAllLinks();
        console.log(links);

        // Group the links by document ID
        const groupedLinks = links.reduce((acc, row) => {
          // Initialize the document's object if it doesn't exist
          if (!acc[row.documentID]) {
            acc[row.documentID] = {
              documentTitle: row.documentTitle,
              links: [],
            };
          }

          // Add each linked document information
          acc[row.documentID].links.push({
            linkedDocID: row.linkedDocID,
            linkedTitle: row.linkedTitle,
            type: row.type,
          });

          return acc;
        }, {});

        // Step 1: Sort the links for each document in ascending order of linkedDocID
        Object.keys(groupedLinks).forEach((docID) => {
          groupedLinks[docID].links.sort((a, b) => a.linkedDocID - b.linkedDocID);
        });

        // Step 2: Format the result as desired
        const formattedResponse = {};
        Object.keys(groupedLinks).forEach((docID) => {
          formattedResponse[docID] = {
            documentTitle: groupedLinks[docID].documentTitle,
            links: groupedLinks[docID].links.map((link) => ({
              linkedDocID: link.linkedDocID,
              linkedTitle: link.linkedTitle,
              type: link.type,
            })),
          };
        });

        resolve(formattedResponse);
      } catch (err) {
        reject(err);
      }
    });
  };

  getAllLinks = () => {
    return new Promise(async (resolve, reject) => {
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
    });
  };
}

export default DocumentController;
