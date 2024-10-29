import db from '../db/db.mjs';
import Document from '../models/document.mjs';

const mapRowsToDoc = (rows) => {
  return rows.map((row) => new Document(row.id, row.title, row.stakeholder, row.scale, row.issuaceDate, row.type, row.connections, row.language, row.pages, row.description));
}

function DocumentDAO() {
  this.getDocuments = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM document';
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(mapRowsToDoc(rows));
      });
    });
  }

  this.addDocument = () => {
    return new Promise((resolve, reject) => {});
  }

  this.addLink = () => {
    return new Promise((resolve, reject) => {});
  }
}

export default DocumentDAO;
