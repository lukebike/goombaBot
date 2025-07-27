const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function openDB() {
  return open({
    filename: "/data/serverdata.db",
    driver: sqlite3.Database,
  });
}

module.exports = openDB;
