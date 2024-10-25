// Module to access the database

import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./db/db.db", (err) => {
  if (err) throw err;
});

export default db;
