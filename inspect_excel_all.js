const xlsx = require('xlsx');

const workbook = xlsx.readFile('C:\\Users\\User\\Downloads\\ENDOSOS_CON_DASHBOARD (1).xlsx');
console.log('Sheet names:', workbook.SheetNames);

for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  console.log(`\nSheet: ${sheetName}`);
  console.log('Total rows:', data.length);
  if (data.length > 0) {
    console.log('First row keys:', Object.keys(data[0]));
    console.log('First row data:', data[0]);
  }
}
