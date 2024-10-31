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
        row.pages || null,
        row.pageFrom || null,
        row.pageTo || null,
        row.lat || null,
        row.long || null
      )
  );
};

class DocumentDAO {
  constructor() {}

  getDocuments = () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM document";
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(mapRowsToDocument(rows));
      });
    });
  };

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

  /**
   * Insert a new document in the database
   * @param {String} title
   * @param {String} stakeholder
   * @param {Number} scale
   * @param {String} issuanceDate
   * @param {String} type
   * @param {String} language
   * @param {String} description
   * @param {Number | null} pages
   * @param {Number | null} pageFrom
   * @param {Number | null} pageTo
   * @param {String | null} lat
   * @param {String | null} long
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
    pages = null,
    pageFrom = null,
    pageTo = null,
    lat = null,
    long = null
  ) => {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO DOCUMENT (title, stakeholder, scale, issuanceDate, type, connections, language, description, pages, pageFrom, pageTo, lat, long) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      db.run(query, [title, stakeholder, scale, issuanceDate, type, 0, language, description, pages, pageFrom, pageTo, lat, long], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes, lastID: this.lastID });
        }
      });
    });
  };

  addLink = (id1, id2, type) => {
    return new Promise((resolve, reject) => {
      //Check if the link already exists in either direction
      const query1 = "SELECT * FROM LINK WHERE docID1=? AND docID2=? OR docID1=? AND docID2=?";
      db.all(query1, [id1, id2, id2, id1], (err, rows) => {
        if (err) {
          console.log("Error in first query");
          reject(err);
        } else if (rows.length > 0) {
          reject({ errCode: 409, errMessage: "Link already exists" });
        } else {
          const query = "INSERT INTO LINK (docID1, docID2, type) VALUES (?, ?, ?)";
          db.run(query, [id1, id2, type], function (err) {
            if (err) {
              console.log("Error in second query", err);
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
