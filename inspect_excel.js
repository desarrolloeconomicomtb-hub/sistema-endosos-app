const xlsx = require('xlsx');

const workbook = xlsx.readFile('C:\\Users\\User\\Downloads\\ENDOSOS_CON_DASHBOARD (1).xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

console.log('Total rows:', data.length);
if (data.length > 0) {
  console.log('First row keys:', Object.keys(data[0]));
  console.log('First row data:', data[0]);
}
