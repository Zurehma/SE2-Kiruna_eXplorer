import db from "../db/db.mjs";
import Document from "../models/document.mjs";

const mapRowsToDocument = (rows) => {
  return rows.map(
    (row) =>
      new Document(
        row.id,
        row.title,
        row.stakeholder,
        row.scale,
        row.issuanceDate,
        row.type,
        row.connections,
        row.language,
        row.description,
        row.coordinates || null,
        row.pages || null,
        row.pageFrom || null,
        row.pageTo || null
      )
  );
};

class DocumentDAO {
  constructor() {}

  // getDocuments = () => {
  //   return new Promise((resolve, reject) => {
  //     const query = "SELECT * FROM document";
  //     db.all(query, [], (err, rows) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(mapRowsToDocument(rows));
  //     });
  //   });
  // };

  /**
   * Get a document by its ID
   * @param {Number} ID
   * @returns {Promise<Document | undefined>} A promise that resolves to a **Document** object or undefined if not found
   */
  getDocumentByID = (ID) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM DOCUMENT WHERE id = ?";

      db.get(query, [ID], (err, row) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve(undefined);
        } else {
          resolve(mapRowsToDocument([row])[0]);
        }
      });
    });
  };

  getDocuments = (queryParameter) => {
    return new Promise((resolve, reject) => {
      try{
        let {type, stakeholder, issuanceDateFrom, issuanceDateTo} = queryParameter ? queryParameter : {};
        let sql = "SELECT * FROM DOCUMENT";
        let sqlConditions = [];
        let sqlParams = [];

        if (type || stakeholder || issuanceDateFrom || issuanceDateTo) {
          if (type) {
            sqlConditions.push("type = ?");
            sqlParams.push(type);
          }
          if (stakeholder) {
            sqlConditions.push("stakeholder = ?");
            sqlParams.push(stakeholder);
          }
          if (issuanceDateFrom && issuanceDateTo) {
            sqlConditions.push("issuanceDate between ? AND ?");
            sqlParams.push(issuanceDateFrom, issuanceDateTo);
          }
          if (issuanceDateFrom && !issuanceDateTo) {
            sqlConditions.push("issuanceDate = ?");
            sqlParams.push(issuanceDateFrom);
          }
        }

        if (sqlConditions.length > 0) {
          sql += " WHERE " + sqlConditions.join(" AND ");
        }

        db.all(sql, sqlParams, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(mapRowsToDocument(rows));
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  /**
   * Get already present document types
   * @returns {Promise<String>} A promise that resolves to an array of strings
   */
  getDocumentTypes = () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM DOCUMENT_TYPE ORDER BY name ASC";

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };

  /**
   * Get already present stakeholders
   * @returns {Promise<String>} A promise that resolves to an array of strings
   */
  getStakeholders = () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM STAKEHOLDER ORDER BY name ASC";

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };

  /**
   * Get already present link types
   * @returns {Promise<String>} A promise that resolves to an array of strings
   */
  getLinkTypes = () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM LINK_TYPE ORDER BY name ASC";

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };

  /**
   * Insert a new document in the database
   * @param {String} title
   * @param {String} stakeholder
   * @param {String | Number} scale
   * @param {String} issuanceDate
   * @param {String} type
   * @param {String} language
   * @param {String} description
   * @param {String | null} coordinates
   * @param {Number | null} pages
   * @param {Number | null} pageFrom
   * @param {Number | null} pageTo
   * @returns {Promise<{ changes: Number, lastID: Number }>} A promise that resolves to the id of the last document inserted and the number of lines changed
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
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO DOCUMENT (title, stakeholder, scale, issuanceDate, type, connections, language, description, coordinates, pages, pageFrom, pageTo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      db.run(query, [title, stakeholder, scale, issuanceDate, type, 0, language, description, coordinates, pages, pageFrom, pageTo], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes, lastID: this.lastID });
        }
      });
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
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE DOCUMENT SET title = ?, stakeholder = ?, scale = ?, issuanceDate = ?, type = ?, language = ?, description = ?, coordinates = ?, pages = ?, pageFrom = ?, pageTo = ? WHERE id = ?";

      db.run(query, [title, stakeholder, scale, issuanceDate, type, language, description, coordinates, pages, pageFrom, pageTo, id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes, lastID: this.lastID });
        }
      });
    });
  };

  /**
   * Get all links of a documents given its ID
   * @param {Number} id1
   * @returns {Promise<{docID1: Number, docID2: Number, type: String}[]>} A promise that resolves to an array of objects with the keys linkedDocID and type
   */
  getLinks = (id1) => {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT 
        CASE 
          WHEN docID1 = ? THEN docID2 
          ELSE docID1 
        END AS linkedDocID, 
        title, l.type 
      FROM LINK l
      JOIN DOCUMENT ON linkedDocID = id
      WHERE docID1 = ? OR docID2 = ?
      ORDER BY linkedDocID ASC`;
      db.all(query, [id1, id1, id1], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const linkIDs = rows.map((row) => ({
            linkedDocID: row.linkedDocID,
            title: row.title,
            type: row.type,
          }));
          resolve(linkIDs);
        }
      });
    });
  };

  /**
   * Insert a new link between two documents
   * @param {Number} id1
   * @param {Number} id2
   * @param {String} type
   *
   */
  addLink = (id1, id2, type) => {
    return new Promise((resolve, reject) => {
      //Check if the link already exists in either direction
      const query1 = "SELECT * FROM LINK WHERE docID1=? AND docID2=? OR docID1=? AND docID2=?";
      db.all(query1, [id1, id2, id2, id1], (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length > 0) {
          reject({ errCode: 409, errMessage: `Link already exists for ${id1} and ${id2}` });
        } else {
          const query = "INSERT INTO LINK (docID1, docID2, type) VALUES (?, ?, ?)";
          db.run(query, [id1, id2, type], function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ changes: this.changes, lastID: this.lastID, type: type });
            }
          });
        }
      });
    });
  };
}

export default DocumentDAO;
export { mapRowsToDocument };