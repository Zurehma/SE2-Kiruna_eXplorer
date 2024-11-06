/**
 * Module to access the database
 */

import sqlite3 from "sqlite3";

const DB_SOURCE = "./db" + (process.env.NODE_ENV === "test" ? "/testdb.db" : "/db.db");

const db = new sqlite3.Database(DB_SOURCE, (err) => {
  if (err) throw err;
  db.run("PRAGMA foreign_keys = ON");
});

export default db;
