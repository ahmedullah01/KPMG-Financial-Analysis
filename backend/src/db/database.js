const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

function initDb() {
  // Create analyses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT,
      industry TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create balance_sheet_data table
  db.exec(`
    CREATE TABLE IF NOT EXISTS balance_sheet_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      analysis_id INTEGER,
      year TEXT,
      category TEXT,
      line_item TEXT,
      value REAL,
      FOREIGN KEY (analysis_id) REFERENCES analyses(id)
    )
  `);

  // Create income_statement_data table
  db.exec(`
    CREATE TABLE IF NOT EXISTS income_statement_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      analysis_id INTEGER,
      year TEXT,
      category TEXT,
      line_item TEXT,
      value REAL,
      FOREIGN KEY (analysis_id) REFERENCES analyses(id)
    )
  `);

  // Create cash_flow_statement_data table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cash_flow_statement_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      analysis_id INTEGER,
      year TEXT,
      category TEXT,
      line_item TEXT,
      value REAL,
      FOREIGN KEY (analysis_id) REFERENCES analyses(id)
    )
  `);
  
  console.log('Database initialized.');
}

module.exports = {
  db,
  initDb
};
