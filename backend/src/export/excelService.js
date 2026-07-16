const ExcelJS = require('exceljs');
const path = require('path');

async function generateExcel(options, bsData, isData, cfData, years) {
  const workbook = new ExcelJS.Workbook();
  let filename = 'Financial_Data.xlsx';

  // Styling properties for KPMG look
  const headerFont = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00338D' } }; // KPMG Blue
  const subHeaderFont = { name: 'Arial', size: 11, bold: true };
  const subHeaderFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };

  const buildWorksheet = (worksheet, years, data, type) => {
    // Define Columns
    const columns = [
      { header: 'Financial Line Item', key: 'lineItem', width: 40 },
      ...years.map(year => ({ header: year.toString(), key: year.toString(), width: 20 }))
    ];
    worksheet.columns = columns;

    // Add Units Note
    worksheet.mergeCells('A1:C1');
    const unitNote = worksheet.getCell('A1');
    unitNote.value = "All amounts are presented in PKR ('000)";
    unitNote.font = { name: 'Arial', size: 10, italic: true };
    
    worksheet.addRow({});
    
    const headerRow = worksheet.getRow(3);
    columns.forEach((col, idx) => {
      headerRow.getCell(idx + 1).value = col.header;
    });
    
    headerRow.eachCell((cell) => {
      cell.font = headerFont;
      cell.fill = headerFill;
      cell.alignment = { horizontal: 'center' };
    });

    const addSectionHeader = (title) => {
      const row = worksheet.addRow({ lineItem: title });
      row.eachCell((cell) => {
        cell.font = subHeaderFont;
        cell.fill = subHeaderFill;
      });
      return row;
    };

    const addDataRows = (items) => {
      if (!items) return;
      items.forEach(item => {
        const rowData = { lineItem: item.name };
        years.forEach(year => {
          rowData[year] = item.values[year] || 0;
        });
        const row = worksheet.addRow(rowData);
        row.eachCell((cell, colNumber) => {
          if (colNumber > 1) {
            cell.numFmt = '#,##0;[Red](#,##0)'; // Accounting format
          }
        });
      });
    };

    const addTotalRow = (title, totalsObj, isGrandTotal = false) => {
      const row = worksheet.addRow({ lineItem: title });
      row.font = { bold: true, size: isGrandTotal ? 12 : 11 };
      if (isGrandTotal) {
        row.fill = subHeaderFill;
      }
      years.forEach(year => {
          const cell = row.getCell(year.toString());
          cell.value = totalsObj ? totalsObj[year] : 0;
          cell.numFmt = '#,##0;[Red](#,##0)';
      });
      worksheet.addRow({});
    };

    if (type === 'balanceSheet') {
      const totalsObj = data.totals || {};
      addSectionHeader('ASSETS');
      addSectionHeader('Non-Current Assets');
      addDataRows(data.nonCurrentAssets);
      addTotalRow('Total Non-Current Assets', totalsObj.nonCurrentAssets);
      
      addSectionHeader('Current Assets');
      addDataRows(data.currentAssets);
      addTotalRow('Total Current Assets', totalsObj.currentAssets);
      
      addTotalRow('TOTAL ASSETS', totalsObj.totalAssets, true);
      worksheet.addRow({});

      addSectionHeader('EQUITY AND LIABILITIES');
      addSectionHeader('Equity');
      addDataRows(data.equity);
      addTotalRow('Total Equity', totalsObj.totalEquity);

      addSectionHeader('Non-Current Liabilities');
      addDataRows(data.nonCurrentLiabilities);
      addTotalRow('Total Non-Current Liabilities', totalsObj.nonCurrentLiabilities);

      addSectionHeader('Current Liabilities');
      addDataRows(data.currentLiabilities);
      addTotalRow('Total Current Liabilities', totalsObj.currentLiabilities);

      addTotalRow('TOTAL EQUITY AND LIABILITIES', totalsObj.totalEquityAndLiabilities, true);
    } 
    else if (type === 'incomeStatement') {
      const totalsObj = data.totals || {};
      addSectionHeader('INCOME STATEMENT');
      
      addDataRows(data.revenue);
      addDataRows(data.costOfServices);
      addTotalRow('Total Cost of Services', totalsObj.totalCostOfServices);
      addTotalRow('Gross Profit / (Loss)', totalsObj.grossProfit, true);

      addDataRows(data.operatingExpenses);
      addTotalRow('Total Operating Expenses - Net', totalsObj.totalOperatingExpenses);
      addTotalRow('Profit / (Loss) from Operations', totalsObj.profitFromOperations, true);

      addDataRows(data.exchangeGainLoss);
      addTotalRow('Profit / (Loss) Before Interest and Taxation', totalsObj.profitBeforeInterestTax, true);

      addDataRows(data.financeCosts);
      addTotalRow('Profit / (Loss) Before Levy & Taxation', totalsObj.profitBeforeLevyTax, true);

      addDataRows(data.levyAndTaxation);
      addTotalRow('Net Profit / (Loss) for the Year', totalsObj.netProfit, true);
    }
    else if (type === 'cashFlowStatement') {
      const totalsObj = data.totals || {};
      addSectionHeader('CASH FLOW STATEMENT');
      
      addSectionHeader('Operating Activities');
      addDataRows(data.operatingActivities);
      addTotalRow('Net Cash from Operating Activities', totalsObj.netCashFromOperating, true);
      
      addSectionHeader('Investing Activities');
      addDataRows(data.investingActivities);
      addTotalRow('Net Cash Used in Investing Activities', totalsObj.netCashUsedInInvesting, true);
      
      addSectionHeader('Financing Activities');
      addDataRows(data.financingActivities);
      addTotalRow('Net Cash from / (Used in) Financing Activities', totalsObj.netCashFromFinancing, true);
      
      addTotalRow('Net Increase / (Decrease) in Cash', totalsObj.netIncreaseInCash, true);
      
      addSectionHeader('Cash and Cash Equivalents');
      addDataRows(data.cashAndCashEquivalents);
      addTotalRow('Cash and Cash Equivalents – End of Year', totalsObj.cashAndCashEquivalentsEndOfYear, true);
    }
  };

  if (options === 'balanceSheet' || options === 'bs_is' || options === 'bs_cf' || options === 'complete') {
    if (bsData) {
      const ws = workbook.addWorksheet('Balance Sheet');
      buildWorksheet(ws, years, bsData, 'balanceSheet');
    }
  }

  if (options === 'incomeStatement' || options === 'bs_is' || options === 'is_cf' || options === 'complete') {
    if (isData) {
      const ws = workbook.addWorksheet('Income Statement');
      buildWorksheet(ws, years, isData, 'incomeStatement');
    }
  }

  if (options === 'cashFlow' || options === 'bs_cf' || options === 'is_cf' || options === 'complete') {
    if (cfData) {
      const ws = workbook.addWorksheet('Cash Flow Statement');
      buildWorksheet(ws, years, cfData, 'cashFlowStatement');
    }
  }

  if (options === 'complete' || options === 'bs_is' || options === 'bs_cf' || options === 'is_cf') {
    filename = 'Financial_Statements.xlsx';
  } else if (options === 'cashFlow') {
    filename = 'Cash_Flow_Statement.xlsx';
  }

  const buffer = await workbook.xlsx.writeBuffer();
  
  return { filename, buffer };
}

module.exports = {
  generateExcel
};
