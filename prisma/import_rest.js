const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const evento = await prisma.evento.findFirst({
    where: { nombre: 'Feria Fiesta y Campo 2026' }
  });

  const categorias = {
    'Comidas y/o Bebidas': await prisma.categoria.findFirst({ where: { nombre: 'Comidas y/o Bebidas' } }),
    'Artesanias': await prisma.categoria.findFirst({ where: { nombre: 'Artesanías' } }),
    'Productos y/o Servicios': await prisma.categoria.findFirst({ where: { nombre: 'Productos y/o Servicios' } })
  };

  const endosos = [
    { control: 'FFC-MTB-CB-016-2026', negocio: 'Ocean Catering by Wilmer', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-017-2026', negocio: 'Tropical Sorbet', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-018-2026', negocio: 'Burgers Grillicious Steaks', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-PS-019-2026', negocio: 'EILIS SHOP', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-CB-020-2026', negocio: 'De La Parra PR', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-AR-021-2026', negocio: 'EXOTIC GARDEN', cat: 'Artesanias' },
    { control: 'FFC-MTB-AR-022-2026', negocio: 'Artes Ephimeral / KalamarPR', cat: 'Artesanias' },
    { control: 'FFC-MTB-AR-023-2026', negocio: 'MACCYLAOS', cat: 'Artesanias' },
    { control: 'FFC-MTB-AR-024-2026', negocio: 'Artesanias', cat: 'Artesanias' },
    { control: 'FFC-MTB-AR-025-2026', negocio: 'Teresitas & Accesories', cat: 'Artesanias' },
    { control: 'FFC-MTB-AR-026-2026', negocio: 'Leaves of Life Creation and More', cat: 'Artesanias' },
    { control: 'FFC-MTB-AR-027-2026', negocio: 'Zumbate PR', cat: 'Artesanias' },
    { control: 'FFC-MTB-PS-028-2026', negocio: 'Juguetes y curiosidades', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-029-2026', negocio: 'Juguetes', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-030-2026', negocio: 'Juguetes', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-031-2026', negocio: 'Variedad Magica Creations', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-032-2026', negocio: 'Corozal Cigars PR', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-033-2026', negocio: 'X & JJ Regalar PR', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-AR-034-2026', negocio: 'SILGA', cat: 'Artesanias' },
    { control: 'FFC-MTB-AR-035-2026', negocio: 'AVARANEO ART', cat: 'Artesanias' },
    { control: 'FFC-MTB-PS-036-2026', negocio: 'Endulces PR', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-AR-037-2026', negocio: 'Correas Colombianas', cat: 'Artesanias' },
    { control: 'FFC-MTB-AR-038-2026', negocio: 'Victoriosas Jewelry', cat: 'Artesanias' },
    { control: 'FFC-MTB-AR-039-2026', negocio: 'Farfalla', cat: 'Artesanias' },
    { control: 'FFC-MTB-AR-040-2026', negocio: 'Creativas', cat: 'Artesanias' },
    { control: 'FFC-MTB-AR-041-2026', negocio: 'Puro Cobre', cat: 'Artesanias' },
    { control: 'FFC-MTB-AR-042-2026', negocio: 'Encantos By Valdes', cat: 'Artesanias' },
    { control: 'FFC-MTB-AR-043-2026', negocio: 'Beautiful Bijoux', cat: 'Artesanias' },
    { control: 'FFC-MTB-PS-044-2026', negocio: 'Power Solar', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-045-2026', negocio: 'T-Mobile', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-046-2026', negocio: 'Power Sport', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-CB-047-2026', negocio: 'Bellamys Sport', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-048-2026', negocio: 'PEGA QUE PEGA', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-PS-049-2026', negocio: 'Detalles and More', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-050-2026', negocio: 'Banco Popular', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-051-2026', negocio: 'Universal Group Inc', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-052-2026', negocio: 'POINT GUARD', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-053-2026', negocio: 'First Medical', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-054-2026', negocio: 'PRTEC', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-055-2026', negocio: 'Red Cross PR', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-056-2026', negocio: 'NVP Landscaping', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-057-2026', negocio: 'ESALEJA', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-058-2026', negocio: 'AMBITIOUS', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-059-2026', negocio: 'Omni Auto Rescue', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-060-2026', negocio: 'Agronegocios', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-061-2026', negocio: 'Farm and Leisure', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-062-2026', negocio: 'MERCADO AGRICOLA', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-063-2026', negocio: 'REMCO', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-064-2026', negocio: 'AMASSAS LINDIAS', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-065-2026', negocio: 'INCLIN POWER', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-066-2026', negocio: 'EN LA MADRE', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-067-2026', negocio: 'MASTER GROUP', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-068-2026', negocio: 'Rancho Del Mar', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-069-2026', negocio: 'Young Farmers and Ranchers', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-070-2026', negocio: 'Agrocentro', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-071-2026', negocio: 'R&R Corp', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-072-2026', negocio: 'ASG', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-CB-073-2026', negocio: 'Cosecha Urbana', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-074-2026', negocio: 'Mofonguitos PR', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-075-2026', negocio: 'EMPANADILLAS FABIAN', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-076-2026', negocio: 'RUMITA MULIGANA', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-077-2026', negocio: 'TOP HAT', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-078-2026', negocio: 'N&N CITRUS', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-079-2026', negocio: 'Fast Pizza Promotions LLC', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-080-2026', negocio: 'Piragua', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-081-2026', negocio: 'TRULLY CAFE', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-082-2026', negocio: 'Mano a Mano PR', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-AR-083-2026', negocio: 'Creaciones Tess', cat: 'Artesanias' },
    { control: 'FFC-MTB-AR-084-2026', negocio: 'Joyeria', cat: 'Artesanias' },
    { control: 'FFC-MTB-PS-085-2026', negocio: 'Novedades', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-PS-086-2026', negocio: 'Luis Camacho', cat: 'Productos y/o Servicios' },
    { control: 'FFC-MTB-CB-087-2026', negocio: 'LUIS MONTALVO VELEZ', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-088-2026', negocio: 'O EMRAS', cat: 'Comidas y/o Bebidas' },
    { control: 'FFC-MTB-CB-089-2026', negocio: 'WANDA L RUIZ GALARZA', cat: 'Comidas y/o Bebidas' },
    { control: 'CAR-MTB-CB-001-2026', negocio: 'WANDA L RUIZ GALARZA', cat: 'Comidas y/o Bebidas' },
  ];

  for (const item of endosos) {
    if (!categorias[item.cat]) {
      console.log('Categoria no encontrada: ', item.cat);
      continue;
    }
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

  console.log('Migración del resto completada.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
