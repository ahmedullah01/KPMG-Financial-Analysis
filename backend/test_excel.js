const { generateExcel } = require('./src/export/excelService');

const test = async () => {
    try {
        const result = await generateExcel(
            'complete', 
            { totals: {}, nonCurrentAssets: [] }, 
            { totals: {}, revenue: [] }, 
            { totals: {}, operatingActivities: [] }, 
            [2021, 2022]
        );
        console.log(result);
    } catch(e) {
        console.error("EXPECTED ERROR:", e);
    }
}
test();
