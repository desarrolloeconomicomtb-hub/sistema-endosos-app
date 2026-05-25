const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const evento = await prisma.evento.findFirst({
    where: { nombre: 'Feria Fiesta y Campo 2026' }
  });

  const categorias = {
    'Comidas y/o Bebidas': await prisma.categoria.upsert({
      where: { id: 'comidas_bebidas' },
      update: {},
      create: { id: 'comidas_bebidas', nombre: 'Comidas y/o Bebidas' }
    }),
    'Artesanias': await prisma.categoria.upsert({
      where: { id: 'artesanias' },
      update: {},
      create: { id: 'artesanias', nombre: 'Artesanías' }
    }),
    'Productos y/o Servicios': await prisma.categoria.upsert({
      where: { id: 'productos_servicios' },
      update: {},
      create: { id: 'productos_servicios', nombre: 'Productos y/o Servicios' }
    })
  };

  const endosos = [
    { control: 'FFC-MTB-CB-001-2026', negocio: 'Artesano', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-002-2026', negocio: 'Limon y Organica', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-003-2026', negocio: 'HOLA Cafe PR', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-004-2026', negocio: 'Delight Limes', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-005-2026', negocio: 'La Margarita Frappe', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-006-2026', negocio: 'Tropical Sorbet', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-007-2026', negocio: 'Dulzura MCS', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-AR-008-2026', negocio: 'Perez Crepe', cat: 'Artesanias' },
    { control: 'FFC-MTB-CB-009-2026', negocio: 'SWEET FARM 2023', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-010-2026', negocio: 'Sugar In PR', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-011-2026', negocio: 'Ice Factory Inc. La Piragua', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-012-2026', negocio: 'Fresitas Dulce', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-013-2026', negocio: 'Tempesti', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-014-2026', negocio: 'El Helador', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-PS-015-2026', negocio: 'Pizzeria Da Sofia', cat: 'Productos y/o Servicios' },
  ];

  for (const item of endosos) {
    await prisma.endoso.upsert({
      where: { controlNumber: item.control },
      update: {},
      create: {
        controlNumber: item.control,
        companyName: item.negocio,
        address: 'Toa Baja, PR',
        eventoId: evento.id,
        categoriaId: categorias[item.cat].id,
        issueDate: new Date('2026-05-11')
      }
    });
  }

  console.log('Migración completada.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
