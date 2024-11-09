/**
 * Module to access the database
 */

import sqlite3 from "sqlite3";

const test_url = "./db/testdb.db";
const dev_url = "./db/db.db";

let DB_SOURCE = process?.env?.NODE_ENV?.trim() === "test" ? test_url : dev_url;

const db = new sqlite3.Database(DB_SOURCE, (err) => {
  if (err) throw err;
  db.run("PRAGMA foreign_keys = ON");
});

export default db;
