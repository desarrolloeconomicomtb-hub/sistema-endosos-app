const fs = require('fs');
const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://sistema-endosos-endosos-pr.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk3NTgyNzQsImlkIjoiMDE5ZTVmZWQtZWIwMS03Y2VlLWE5YmUtN2YxNWE2MzAxMzkzIiwicmlkIjoiZjI5NjFkYzItNjU2OC00ZWRjLWJjNTAtZDA1OTQ3MTA0YzhhIn0.RmSXe6n5dwaFHk2fiJjvpsNtiwj0Qaqzpk7xqc0_W57UFUEMoxg4crg3Q4dDMjrifBmiXRGp05SKk23LqY3ZCA'
});

async function run() {
  const sql = fs.readFileSync('schema.sql', 'utf8');
  const statements = sql.split(';').filter(s => s.trim() !== '');
  
  for (const statement of statements) {
    if (statement.trim()) {
      console.log('Executing:', statement.trim().substring(0, 50) + '...');
      await client.execute(statement);
    }
  }
  console.log('Done!');
}

run().catch(console.error);
