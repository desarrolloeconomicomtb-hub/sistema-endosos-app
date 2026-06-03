const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://sistema-endosos-endosos-pr.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk3NTgyNzQsImlkIjoiMDE5ZTVmZWQtZWIwMS03Y2VlLWE5YmUtN2YxNWE2MzAxMzkzIiwicmlkIjoiZjI5NjFkYzItNjU2OC00ZWRjLWJjNTAtZDA1OTQ3MTA0YzhhIn0.RmSXe6n5dwaFHk2fiJjvpsNtiwj0Qaqzpk7xqc0_W57UFUEMoxg4crg3Q4dDMjrifBmiXRGp05SKk23LqY3ZCA'
});

async function run() {
  const alterStatements = [
    `ALTER TABLE "Endoso" ADD COLUMN "firmanteNombre" TEXT DEFAULT 'Shirley Torres Reyes';`,
    `ALTER TABLE "Endoso" ADD COLUMN "firmantePuesto" TEXT DEFAULT 'Ayudante Especial';`,
    `ALTER TABLE "Endoso" ADD COLUMN "firmanteExtension" TEXT DEFAULT '2133';`,
    `ALTER TABLE "Endoso" ADD COLUMN "firmanteEmail" TEXT DEFAULT 'storres@toabaja.com';`
  ];

  for (const stmt of alterStatements) {
    try {
      console.log('Executing:', stmt);
      await client.execute(stmt);
      console.log('Success!');
    } catch (err) {
      console.error('Error executing statement:', err.message);
    }
  }
}

run().catch(console.error);
