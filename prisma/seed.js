const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.evento.create({
    data: {
      nombre: 'Feria Fiesta y Campo 2026',
      fechas: '15, 16 y 17 de mayo de 2026',
      ubicacion: 'Balneario de Punta Salinas, Toa Baja, Puerto Rico',
    },
  });

  await prisma.categoria.create({
    data: {
      nombre: 'Productos y/o Servicios',
    },
  });
  
  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
