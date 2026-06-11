import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintAction from "./PrintAction";
import fs from 'fs';
import path from 'path';

export default async function PrintEndosoPage(
  props: { 
    params: Promise<{ id: string }>,
    searchParams: Promise<{ companyName?: string, puesto?: string }>
  }
) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const endoso = await prisma.endoso.findUnique({
    where: { id: params.id },
    include: {
      evento: true,
      categoria: true
    }
  });

  if (!endoso) return notFound();

  const issueDateActual = new Date().toLocaleDateString('es-PR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Custom or fallback firmante
  const firmaNombre = searchParams.companyName || endoso.firmanteNombre || 'Shirley Torres Reyes';
  const firmaPuesto = searchParams.puesto || endoso.firmantePuesto || 'Ayudante Especial';
  const firmaExtension = endoso.firmanteExtension || '2133';
  const firmaEmail = endoso.firmanteEmail || 'storres@toabaja.com';

  // Smart salutation logic
  const rep = (endoso.representante || '').trim();
  const company = (endoso.companyName || '').trim();
  const lowerRep = rep.toLowerCase();
  const lowerCompany = company.toLowerCase();

  const hasValidRep = rep !== '' && 
    lowerRep !== 'representante' && 
    lowerRep !== 'representantes' && 
    lowerRep !== 'representante autorizado' &&
    lowerRep !== 'señores' &&
    lowerRep !== 'senores' &&
    lowerRep !== 'entidad';

  let targetName = '';
  let addresseeLine = '';

  if (hasValidRep) {
    targetName = rep;
    addresseeLine = rep;
  } else {
    targetName = company;
    addresseeLine = '';
  }

  const lowerTarget = targetName.toLowerCase();
  let saludo = '';

  if (lowerTarget.startsWith('sr. ')) {
    saludo = `Estimado señor ${targetName.substring(4)}:`;
  } else if (lowerTarget.startsWith('sra. ')) {
    saludo = `Estimada señora ${targetName.substring(5)}:`;
  } else if (lowerTarget.startsWith('srta. ')) {
    saludo = `Estimada señorita ${targetName.substring(6)}:`;
  } else if (lowerTarget.startsWith('dr. ')) {
    saludo = `Estimado doctor ${targetName.substring(4)}:`;
  } else if (lowerTarget.startsWith('dra. ')) {
    saludo = `Estimada doctora ${targetName.substring(5)}:`;
  } else if (lowerTarget.startsWith('ing. ')) {
    saludo = `Estimado ingeniero ${targetName.substring(5)}:`;
  } else if (lowerTarget.startsWith('inga. ')) {
    saludo = `Estimada ingeniera ${targetName.substring(6)}:`;
  } else if (lowerTarget.startsWith('lic. ')) {
    saludo = `Estimado licenciado ${targetName.substring(5)}:`;
  } else if (lowerTarget.startsWith('lica. ')) {
    saludo = `Estimada licenciada ${targetName.substring(6)}:`;
  } else if (lowerTarget === 'señores' || lowerTarget === 'senores' || lowerTarget === 'entidad') {
    saludo = 'Estimados señores:';
  } else {
    if (hasValidRep) {
      saludo = `Estimado(a) ${targetName}:`;
    } else {
      saludo = `Estimados representantes de ${targetName}:`;
    }
  }

  // Load Base64 images for offline Word document export
  const escudoPath = path.join(process.cwd(), 'public/images/escudo-toa-baja.png');
  const logoPath = path.join(process.cwd(), 'public/images/logo-toa-baja.png');
  
  let escudoBase64 = '';
  let logoBase64 = '';
  try {
    escudoBase64 = fs.readFileSync(escudoPath).toString('base64');
    logoBase64 = fs.readFileSync(logoPath).toString('base64');
  } catch (e) {
    console.error('Error loading print page images for Base64 conversion:', e);
  }

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Print Controls (hidden on print) */}
      <PrintAction 
        endoso={endoso}
        escudoBase64={escudoBase64}
        logoBase64={logoBase64}
        firmaNombre={firmaNombre}
        firmaPuesto={firmaPuesto}
        firmaExtension={firmaExtension}
        firmaEmail={firmaEmail}
        issueDateActual={issueDateActual}
        addresseeLine={addresseeLine}
        saludo={saludo}
      />

      {/* A4/Letter Page Container */}
      <div id="carta-documento" className="max-w-[8.5in] mx-auto bg-white print:m-0 print:shadow-none shadow-sm min-h-[11in] print:h-[11in] px-[0.6in] pt-[0.6in] pb-[0.40in] box-border relative text-[11.5pt] font-sans leading-relaxed flex flex-col text-black">
        
        {/* Header / Logos */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col items-center w-40">
            <img src="/images/escudo-toa-baja.png" alt="Escudo Toa Baja" className="w-16 h-auto mb-1" />
            <p className="text-[6pt] text-center leading-tight whitespace-nowrap">Hon. Bernardo "Betito" Márquez García</p>
            <p className="text-[6pt] text-center">Alcalde</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-[11.5pt]">Gobierno de Puerto Rico</p>
            <p className="text-[14pt] font-bold text-[#1b5e20]">Municipio Autónomo de Toa Baja</p>
            <p className="text-[11.5pt] italic">Oficina del Alcalde</p>
          </div>
          <div className="w-32 flex justify-end">
            <img src="/images/logo-toa-baja.png" alt="Logo Toa Baja" className="w-24 h-auto" />
          </div>
        </div>

        {/* Date and Control Number */}
        <div className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
          <p>{issueDateActual}</p>
          <div className="border border-[#1b5e20] px-3 py-0.5 text-[9.5pt] font-bold text-[#1b5e20]">
            Núm. Control: {endoso.controlNumber.replace(/-/g, '_')}
          </div>
        </div>

        {/* Addressee */}
        <div style={{ marginBottom: '16px' }} className="text-[11.5pt] leading-tight">
          {addresseeLine && <p className="font-bold">{addresseeLine}</p>}
          <p className="font-bold">{endoso.companyName}</p>
          <p>{endoso.ubicacion || 'Toa Baja, PR'}</p>
        </div>

        {/* Salutation */}
        <div style={{ marginBottom: '16px' }}>
          <p>{saludo}</p>
        </div>

        {/* Body Paragraphs */}
        <div className="text-justify text-[11.5pt]" style={{ marginBottom: '16px' }}>
          <p className="mb-4">
            Reciba un cordial saludo de parte de todos los que laboramos en el Municipio de Toa Baja. Hemos recibido su petición para participar en la categoría denominada {endoso.evento?.nombre || 'Evento No Asignado'}, a celebrarse los días {endoso.evento?.fechas || '15, 16 y 17 de mayo de 2026'}, en {endoso.evento?.ubicacion || 'el Balneario de Punta Salinas, Toa Baja, Puerto Rico'}{endoso.tarima ? ` (área adyacente a ${endoso.tarima})` : ''}.
          </p>

          <p className="mb-4">
            El Municipio de Toa Baja ha evaluado su petición y no tiene objeción en que opere (1) quiosco provisional para la venta de <strong>{endoso.descripcion || '[Descripción de venta]'}</strong>. No obstante, el otorgamiento de este endoso está sujeto a que se cumplan con todos los requerimientos establecidos por ley, reglamento u ordenanza en vigor aplicable, así como realizar los trámites correspondientes con el personal de la Oficina de Finanzas Municipales.
          </p>

          <p className="mb-4">
            Igualmente, si su intención es la venta de bebidas alcohólicas, deberá obtener el endoso o licencia correspondiente otorgada por el Departamento de Hacienda para esos fines.
          </p>

          <p className="mb-4">
            Este endoso representa un visto bueno del Municipio en la obtención de cualquier permiso, licencia y/o trámite gubernamental requerido para que el proponente lleve a cabo su propósito.
          </p>

          <p className="mb-0">
            El Municipio interesa mantener el más alto grado de coordinación y logística para asegurar que esta categoría tenga el éxito que todos esperamos. Confiamos en que la aportación que usted pueda brindar para el desarrollo de la {endoso.evento?.nombre || 'Evento Especial'} la convierta en un evento que sea considerado por nuestros ciudadanos un verdadero Orgullo Llanero.
          </p>
        </div>

        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
          <p style={{ marginBottom: '76px' }}>Cordialmente,</p>
          
          <div>
            <p className="font-bold">{firmaNombre}</p>
            <p>{firmaPuesto}</p>
            <p>Municipio Autónomo de Toa Baja</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto text-center text-[7.5pt] text-gray-500 border-t-2 border-[#1b5e20] pt-2 pb-2">
          Dirección: Apartado 2359, Toa Baja, P.R. 00951 &nbsp;&nbsp;|&nbsp;&nbsp; Teléfono: (787) 261-0202 &nbsp;&nbsp;|&nbsp;&nbsp; Extensión: {firmaExtension} &nbsp;&nbsp;|&nbsp;&nbsp; Correo Electrónico: {firmaEmail}
        </div>

      </div>
    </div>
  );
}
