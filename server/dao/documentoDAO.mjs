import db from "../db/db.mjs";

function DocumentDAO() {
  this.getDocuments = () => {
    return new Promise((resolve, reject) => {});
  };

  /**
   * Get a document by its ID
   * @param {Number} ID
   * @returns A promise that resolves to a document object or undefined if not found
   */
  this.getDocumentByID = (ID) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM DOCUMENT WHERE id = ?";

      db.run(query, [ID], (err, row) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve(undefined);
        } else {
          resolve(row);
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
   * @param {String | null} lat
   * @param {String | null} long
   * @returns A promise that resolves to the id of the last document inserted
   */
  this.addDocument = (
    title,
    stakeholder,
    scale,
    issuanceDate,
    type,
    language,
    description,
    pages = null,
    lat = null,
    long = null
  ) => {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO DOCUMENT (title, stakeholder, scale, issuanceDate, type, connections, language, description, pages, lat, long) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      db.run(
        query,
        [title, stakeholder, scale, issuanceDate, type, 0, language, description, pages, lat, long],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes, lastID: this.lastID });
          }
        }
      );
    });
  };

  this.addLink = () => {
    return new Promise((resolve, reject) => {});
  };
}

export default DocumentDAO;
