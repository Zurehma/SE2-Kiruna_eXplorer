import db from "../db/db.mjs";
import AttachmentInfo from "../models/attachmentInfo.mjs";

const mapRowsToAttachmentInfo = (rows) => {
  return rows.map((row) => new AttachmentInfo(row.id, row.docID, row.name, row.path, row.format));
};

class AttachmentDAO {
  constructor() {}

  /**
   * Add info for a new attachment of an existing document
   * @param {Number} docID
   * @param {String} path
   * @param {String} format
   * @returns {Promise<{ changes: Number, lastID: Number }>}
   */
  addAttachment = (docID, name, path, format) => {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO ATTACHMENT (docID, name, path, format) VALUES (?, ?, ?, ?)";

      db.run(query, [docID, name, path, format], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes, lastID: this.lastID });
        }
      });
    });
  };

  /**
   * Get all the attachments of a document by its ID
   * @param {Number} docID
   * @returns {Promise<Array<AttachmentInfo>>}
   */
  getAttachmentsByDocumentID = (docID) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM ATTACHMENT WHERE docID = ?";

      db.all(query, [docID], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(mapRowsToAttachmentInfo(rows));
        }
      });
    });
  };

  /**
   * Get a single attachment by its ID
   * @param {Number} attachmentID
   * @returns {Promise<AttachmentInfo>}
   */
  getAttachmentByID = (attachmentID) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM ATTACHMENT WHERE id = ?";

      db.get(query, [attachmentID], (err, row) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve(undefined);
        } else {
          resolve(mapRowsToAttachmentInfo([row])[0]);
        }
      });
    });
  };

  /**
   *
   * @param {Number} attachmentID
   * @returns {Promise<{ changes: Number, lastID: Number }>}
   */
  deleteAttachmentByID = (attachmentID) => {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM ATTACHMENT WHERE id = ?";

      db.run(query, [attachmentID], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes, lastID: this.lastID });
        }
      });
    });
  };
}

export default AttachmentDAO;
