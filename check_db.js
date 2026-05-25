const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const endosos = await prisma.endoso.findMany({
    orderBy: { createdAt: 'asc' },
    take: 5
  });
  console.log(endosos);
  const count = await prisma.endoso.count();
  console.log('Total endosos:', count);
}

main().finally(() => prisma.$disconnect());
