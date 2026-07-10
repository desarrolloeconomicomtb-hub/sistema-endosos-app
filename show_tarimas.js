const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allEndosos = await prisma.endoso.findMany({
    select: {
      id: true,
      tarima: true,
      companyName: true
    }
  });

  const frequency = {};
  allEndosos.forEach(e => {
    const val = e.tarima;
    frequency[val] = (frequency[val] || 0) + 1;
  });

  console.log('Tarima values frequency:', frequency);
  
  // Show non-null records to see what needs mapping
  const nonNull = allEndosos.filter(e => e.tarima !== null);
  console.log('Non-null tarimas:', nonNull);
}

main().finally(() => prisma.$disconnect());
