import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.endoso.findMany({
    where: {
      controlNumber: { contains: 'FB' }
    },
    include: {
      categoria: true,
      evento: true
    }
  });
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
