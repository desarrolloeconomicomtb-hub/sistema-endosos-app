const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://sistema-endosos-endosos-pr.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk3NTgyNzQsImlkIjoiMDE5ZTVmZWQtZWIwMS03Y2VlLWE5YmUtN2YxNWE2MzAxMzkzIiwicmlkIjoiZjI5NjFkYzItNjU2OC00ZWRjLWJjNTAtZDA1OTQ3MTA0YzhhIn0.RmSXe6n5dwaFHk2fiJjvpsNtiwj0Qaqzpk7xqc0_W57UFUEMoxg4crg3Q4dDMjrifBmiXRGp05SKk23LqY3ZCA'
});

async function run() {
  console.log('Altering table Endoso in Turso production...');
  
  try {
    console.log('Adding reciboPatenteUrl...');
    await client.execute('ALTER TABLE "Endoso" ADD COLUMN "reciboPatenteUrl" TEXT;');
  } catch (e) {
    console.log('reciboPatenteUrl might already exist:', e.message);
  }

  try {
    console.log('Adding reciboAmbulanteUrl...');
    await client.execute('ALTER TABLE "Endoso" ADD COLUMN "reciboAmbulanteUrl" TEXT;');
  } catch (e) {
    console.log('reciboAmbulanteUrl might already exist:', e.message);
  }

  try {
    console.log('Adding reciboBebidasUrl...');
    await client.execute('ALTER TABLE "Endoso" ADD COLUMN "reciboBebidasUrl" TEXT;');
  } catch (e) {
    console.log('reciboBebidasUrl might already exist:', e.message);
  }

  console.log('Turso alter completed successfully!');
}

run().catch(console.error);
