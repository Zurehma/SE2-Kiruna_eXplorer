/**
 * Module to access the database
 */

import sqlite3 from "sqlite3";
const test_url = "./db/testdb.db";
const dev_url = "./db/db.db";

let url = process?.env?.NODE_ENV?.trim() === "test" ? test_url : dev_url; 

const db = new sqlite3.Database(url, (err) => {
  if (err) throw err;
});



export default db;
