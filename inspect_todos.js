const xlsx = require('xlsx');

const workbook = xlsx.readFile('C:\\Users\\User\\Downloads\\ENDOSOS_CON_DASHBOARD (1).xlsx');
const sheet = workbook.Sheets['Todos los Endosos'];
// Skip the first row because it's a merged title header, the second row has the actual column names
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

console.log('Total rows (array):', data.length);
if (data.length > 1) {
  console.log('Headers (row 2):', data[1]);
  console.log('First data row:', data[2]);
  console.log('Last data row:', data[data.length - 1]);
}
