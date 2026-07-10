const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allEndosos = await prisma.endoso.findMany({
    select: {
      id: true,
      status: true,
      companyName: true,
      reciboPatente: true,
      reciboAmbulante: true,
      reciboBebidas: true,
      exentoPago: true
    }
  });

  const frequency = {};
  allEndosos.forEach(e => {
    const val = e.status;
    frequency[val] = (frequency[val] || 0) + 1;
  });

  console.log('Status field frequency:', frequency);

  const missingReceipts = allEndosos.filter(e => {
    const isPaid = e.reciboPatente || e.reciboAmbulante || e.reciboBebidas;
    const isExempt = e.exentoPago;
    return !isPaid && !isExempt;
  });

  console.log(`Endosos without payment/exemption: ${missingReceipts.length}`);
}

main().finally(() => prisma.$disconnect());
