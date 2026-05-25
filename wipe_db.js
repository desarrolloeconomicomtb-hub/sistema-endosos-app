const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.endoso.deleteMany();
  console.log('Deleted all dummy endosos.');
}

main().finally(() => prisma.$disconnect());
