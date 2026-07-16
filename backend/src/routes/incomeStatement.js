const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// Save income statement data
router.post('/save', async (req, res) => {
  const { analysisId, years, data, exportOptions } = req.body;
  
  if (!analysisId || !years || !data) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  try {
    // 1. Save to Database (using a transaction)
    const saveToDb = db.transaction((isData) => {
      // Ensure analysis exists (V1 Mock)
      const analysisExists = db.prepare('SELECT id FROM analyses WHERE id = ?').get(analysisId);
      if (!analysisExists) {
        db.prepare('INSERT INTO analyses (id, company_name, industry) VALUES (?, ?, ?)').run(analysisId, 'KPMG Client', 'Aviation');
      }

      const deleteStmt = db.prepare('DELETE FROM income_statement_data WHERE analysis_id = ?');
      deleteStmt.run(analysisId);

      const insertStmt = db.prepare(`
        INSERT INTO income_statement_data (analysis_id, year, category, line_item, value) 
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

      insertCategory('Revenue', isData.revenue);
      insertCategory('Cost of Services', isData.costOfServices);
      insertCategory('Operating Expenses', isData.operatingExpenses);
      insertCategory('Exchange Gain / (Loss)', isData.exchangeGainLoss);
      insertCategory('Finance Costs', isData.financeCosts);
      insertCategory('Levy & Taxation', isData.levyAndTaxation);
    });

    saveToDb(data);

    res.json({ success: true, message: 'Income Statement data saved successfully.' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
