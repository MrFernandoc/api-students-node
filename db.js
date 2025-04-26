// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'students.db');
const db = new sqlite3.Database(dbPath);

// Crear tabla si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `);
});

module.exports = db;
