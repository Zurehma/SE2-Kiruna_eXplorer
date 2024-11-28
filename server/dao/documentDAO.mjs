import db from "../db/db.mjs";
import Document from "../models/document.mjs";

const mapRowsToDocument = (documentRows, stakeholderRows) => {
  return documentRows.map(
    (row) =>
      new Document(
        row.id,
        row.title,
        stakeholderRows.filter((stakeholderRow) => stakeholderRow.docID === row.id).map((stakeholderRow) => stakeholderRow.stakeholder),
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
  /**
   * Get a document by its ID
   * @param {Number} ID
   * @returns {Promise<Document | undefined>} A promise that resolves to a **Document** object or undefined if not found
   */
  getDocumentByID = (ID) => {
    return new Promise((resolve, reject) => {
      const query1 = "SELECT * FROM DOCUMENT WHERE id = ?";

      db.get(query1, [ID], (err, documentRow) => {
        if (err) {
          reject(err);
        } else if (documentRow === undefined) {
          resolve(undefined);
        } else {
          const query2 = "SELECT * FROM DOCUMENT_STAKEHOLDER WHERE docID = ?";

          db.all(query2, [ID], (err, stakeholderRows) => {
            if (err) {
              reject(err);
            } else {
              resolve(mapRowsToDocument([documentRow], stakeholderRows)[0]);
            }
          });
        }
      });
    });
  };

  getDocuments = async (queryParameter, limit, offset) => {
    try {
        const { type, stakeholder, issuanceDateFrom, issuanceDateTo } = queryParameter || {};
        let sql = "SELECT * FROM DOCUMENT";
        const sqlConditions = [];
        const sqlParams = [];
        const sqlLimit = [];

        if (type) {
            sqlConditions.push("DOCUMENT.type = ?");
            sqlParams.push(type);
        }
        if (stakeholder) {
            sqlConditions.push("DOCUMENT_STAKEHOLDER.stakeholder = ?");
            sqlParams.push(stakeholder);
        }
        if (issuanceDateFrom) {
            sqlConditions.push("DOCUMENT.issuanceDate >= ?");
            sqlParams.push(issuanceDateFrom);
        }
        if (issuanceDateTo) {
            sqlConditions.push("DOCUMENT.issuanceDate <= ?");
            sqlParams.push(issuanceDateTo);
        }
        if (limit) {
            sqlLimit.push(" LIMIT ?");
            sqlParams.push(limit);
        }
        if (offset) {
            sqlLimit.push(" OFFSET ?");
            sqlParams.push(offset);
        }

        if (sqlConditions.length > 0) {
            sql += " JOIN DOCUMENT_STAKEHOLDER ON DOCUMENT.id = DOCUMENT_STAKEHOLDER.docID";
            sql += " WHERE " + sqlConditions.join(" AND ");
        }
        if (sqlLimit.length > 0) {
            sql += sqlLimit.join("");
        }

        const rows = await new Promise((resolve, reject) => {
            db.all(sql, sqlParams, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        return await this.getStakeholdersOfDocument(rows);

    } catch (err) {
        throw err;
    }};

  getStakeholdersOfDocument = async (rows) => {
    try {
        const idArray = rows.map((row) => row.id); 
        const query2 = `SELECT * FROM DOCUMENT_STAKEHOLDER WHERE docID IN (${idArray.map(() => '?').join(',')})`;

        const stakeholderRows = await new Promise((resolve, reject) => {
            db.all(query2, idArray, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
        return mapRowsToDocument(rows, stakeholderRows);
    } catch (err) {
        throw err;
    }
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
   * @param {String | Number} scale
   * @param {String} issuanceDate
   * @param {String} type
   * @param {String} language
   * @param {String} description
   * @param {Array<String> | null} coordinates
   * @param {Number | null} pages
   * @param {Number | null} pageFrom
   * @param {Number | null} pageTo
   * @returns {Promise<{ changes: Number, lastID: Number }>} A promise that resolves to the id of the last document inserted and the number of lines changed
   */
  addDocument = (title, scale, issuanceDate, type, language, description, coordinates = null, pages = null, pageFrom = null, pageTo = null) => {
    return new Promise((resolve, reject) => {
      const query1 =
        "INSERT INTO DOCUMENT (title, scale, issuanceDate, type, connections, language, description, coordinates, pages, pageFrom, pageTo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      db.run(query1, [title, scale, issuanceDate, type, 0, language, description, coordinates, pages, pageFrom, pageTo], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes, lastID: this.lastID });
        }
      });
    });
  };

  /**
   * Update an existing document in the database
   * @param {String} title
   * @param {String | Number} scale
   * @param {String} issuanceDate
   * @param {String} type
   * @param {String} language
   * @param {String} description
   * @param {Array<String> | null} coordinates
   * @param {Number | null} pages
   * @param {Number | null} pageFrom
   * @param {Number | null} pageTo
   * @returns {Promise<{ changes: Number, lastID: Number }>} A promise that resolves to the id of the document updated and the number of lines changed
   */
  updateDocument = (id, title, scale, issuanceDate, type, language, description, coordinates = null, pages = null, pageFrom = null, pageTo = null) => {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE DOCUMENT SET title = ?, scale = ?, issuanceDate = ?, type = ?, language = ?, description = ?, coordinates = ?, pages = ?, pageFrom = ?, pageTo = ? WHERE id = ?";

      db.run(query, [title, scale, issuanceDate, type, language, description, coordinates, pages, pageFrom, pageTo, id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes, lastID: this.lastID });
        }
      });
    });
  };

  /**
   * Add a new stakeholder for an existing document
   * @param {Number} docID
   * @param {String} stakeholder
   * @returns {Promise<null>} A promise that resolves to null
   */
  addStakeholder = (docID, stakeholder) => {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO DOCUMENT_STAKEHOLDER (docID, stakeholder) VALUES (?, ?)";

      db.run(query, [docID, stakeholder], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  /**
   * Delete all the assigned stakeholders for an existing document
   * @param {Number} docID
   * @returns {Promise<null>} A promise that resolves to null
   */
  deleteStakeholders = (docID) => {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM DOCUMENT_STAKEHOLDER WHERE docID = ?";

      db.run(query, [docID], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
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

  /*getAllLinks = () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          d1.id AS documentID,
          d1.title AS documentTitle,
          l.docID1,
          l.docID2,
          d2.id AS linkedDocID,
          d2.title AS linkedTitle,
          l.type
        FROM LINK l
        JOIN DOCUMENT d1 ON l.docID1 = d1.id
        JOIN DOCUMENT d2 ON l.docID2 = d2.id
        ORDER BY documentID, linkedDocID ASC`;
  
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };*/

  getAllLinks = () => {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT 
      CASE WHEN DocID1 < DocID2 THEN DocID1 ELSE DocID2 END AS DocID1,
      CASE WHEN DocID1 < DocID2 THEN DocID2 ELSE DocID1 END AS DocID2,
      type
      FROM LINK
      ORDER BY DocID1 ASC, DocID2 ASC;
    `;
  
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  

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
      const query1 = "SELECT * FROM LINK WHERE (docID1=? AND docID2=? AND type=?) OR (docID1=? AND docID2=? AND type=?)";
      db.all(query1, [id1, id2, type, id2, id1, type], (err, rows) => {
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
