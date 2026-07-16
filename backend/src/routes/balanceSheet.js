const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// Create a new analysis
router.post('/analysis', (req, res) => {
  const { industry, companyName } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO analyses (industry, company_name) VALUES (?, ?)');
    const info = stmt.run(industry || 'Aviation', companyName || 'KPMG Client');
    res.json({ success: true, analysisId: info.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save balance sheet data
router.post('/save', async (req, res) => {
  const { analysisId, years, data } = req.body;
  
  if (!analysisId || !years || !data) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  try {
    // 1. Save to Database (using a transaction)
    const saveToDb = db.transaction((bsData) => {
      // Ensure analysis exists (V1 Mock)
      const analysisExists = db.prepare('SELECT id FROM analyses WHERE id = ?').get(analysisId);
      if (!analysisExists) {
        db.prepare('INSERT INTO analyses (id, company_name, industry) VALUES (?, ?, ?)').run(analysisId, 'KPMG Client', 'Aviation');
      }

      const deleteStmt = db.prepare('DELETE FROM balance_sheet_data WHERE analysis_id = ?');
      deleteStmt.run(analysisId);

      const insertStmt = db.prepare(`
        INSERT INTO balance_sheet_data (analysis_id, year, category, line_item, value) 
        VALUES (?, ?, ?, ?, ?)
      `);

      // Helper to insert category array
      const insertCategory = (categoryName, items) => {
        if (!items) return;
        items.forEach(item => {
          years.forEach(year => {
            const value = item.values[year] || 0;
            insertStmt.run(analysisId, year.toString(), categoryName, item.name, value);
          });
        });
      };

      insertCategory('Non-Current Assets', bsData.nonCurrentAssets);
      insertCategory('Current Assets', bsData.currentAssets);
      insertCategory('Equity', bsData.equity);
      insertCategory('Non-Current Liabilities', bsData.nonCurrentLiabilities);
      insertCategory('Current Liabilities', bsData.currentLiabilities);
    });

    saveToDb(data);

    res.json({ success: true, message: 'Balance Sheet data saved successfully.' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
