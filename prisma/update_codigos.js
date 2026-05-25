const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ffc = await prisma.evento.findFirst({ where: { nombre: { contains: 'Feria' } } });
  if (ffc) {
    await prisma.evento.update({ where: { id: ffc.id }, data: { codigo: 'FFC' } });
    console.log('Updated FFC');
  }

  const car = await prisma.evento.findFirst({ where: { nombre: { contains: 'Carrera' } } });
  if (car) {
    await prisma.evento.update({ where: { id: car.id }, data: { codigo: 'CAR' } });
    console.log('Updated CAR');
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
