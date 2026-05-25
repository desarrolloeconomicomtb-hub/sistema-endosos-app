const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');
const prisma = new PrismaClient();

async function main() {
  const workbook = xlsx.readFile('C:\\Users\\User\\Downloads\\ENDOSOS_CON_DASHBOARD (1).xlsx');
  const sheet = workbook.Sheets['Todos los Endosos'];
  const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  // Data starts at index 3
  const rows = rawData.slice(3).filter(r => r[1]); // Ensure it has a control number

  for (const row of rows) {
    const controlNumber = row[1];
    const companyName = row[2] || '';
    const representante = row[3] || '';
    const telefono = row[4] || '';
    const email = row[5] || '';
    const categoriaRaw = row[6] || '';
    const descripcion = row[7] || '';
    const eventoRaw = row[8] || '';
    const fechasEvento = row[9] || '';
    const ubicacion = row[10] || '';
    // We ignore Fecha Endoso and Estado since we'll generate them now or just set default

    // Parse controlNumber: FFC-MTB-CB-001-2026
    const parts = controlNumber.split('-');
    const eventoCode = parts[0];
    let tipoCode = parts.length >= 3 ? parts[2] : 'MISC';

    // Evento
    let evento = await prisma.evento.findUnique({ where: { codigo: eventoCode } });
    if (!evento) {
      evento = await prisma.evento.create({
        data: {
          codigo: eventoCode,
          nombre: eventoRaw || `Evento ${eventoCode}`,
          fechas: fechasEvento,
          ubicacion: ubicacion
        }
      });
    }

    // Categoria
    // We want to map the raw category string to a Categoria model
    // Let's just find or create based on the string provided, or use tipoCode
    let categoria = await prisma.categoria.findFirst({ where: { nombre: { contains: categoriaRaw.substring(0, 4) } } });
    if (!categoria) {
      categoria = await prisma.categoria.create({
        data: { nombre: categoriaRaw || tipoCode }
      });
    }

    await prisma.endoso.create({
      data: {
        controlNumber,
        companyName,
        representante,
        telefono,
        email,
        descripcion,
        fechasEvento,
        ubicacion,
        eventoId: evento.id,
        categoriaId: categoria.id
      }
    });
    
    console.log(`Imported: ${controlNumber} - ${companyName}`);
  }

  console.log(`Imported ${rows.length} endosos successfully.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
