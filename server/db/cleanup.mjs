import db from "./db.mjs";

/**
 * Cleanup function to clear the database before any integration test
 */

export default cleanup = () => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM USER", function (_) {
      db.run("DELETE FROM DOCUMENT", function (_) {
        resolve();
      });
    });
  });
};
