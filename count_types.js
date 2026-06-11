import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const endosos = await prisma.endoso.findMany({
    select: {
      companyName: true,
      descripcion: true,
      categoria: { select: { nombre: true } }
    }
  });

  endosos.forEach(e => {
    console.log(`- ${e.companyName} | ${e.categoria?.nombre || 'Sin Categoria'} | ${e.descripcion}`);
  });
}

main().catch(console.error);
