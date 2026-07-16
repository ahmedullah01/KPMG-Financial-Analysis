const express = require('express');
const router = express.Router();
const { generateExcel } = require('../export/excelService');

router.post('/', async (req, res) => {
  const { option, years, bsData, isData, cfData } = req.body;
  
  if (!option || !years) {
    return res.status(400).json({ error: 'Missing required export data' });
  }

  try {
    const result = await generateExcel(option, bsData, isData, cfData, years);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    
    res.send(result.buffer);
  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
