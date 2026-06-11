import { prisma } from '@/lib/prisma';
import BatchPrintHeader from './BatchPrintHeader';

export default async function BatchCartaEndoso({ searchParams }: { searchParams: Promise<{ ids?: string | string[] }> }) {
  const resolvedParams = (await searchParams) || {};
  const idArray = Array.isArray(resolvedParams.ids) ? resolvedParams.ids : (resolvedParams.ids ? [resolvedParams.ids] : []);
  
  if (idArray.length === 0) {
    return <div className="container p-8"><h1>No se seleccionaron endosos para imprimir.</h1></div>;
  }

  const endosos = await prisma.endoso.findMany({ 
    where: { id: { in: idArray } },
    include: {
      evento: true,
      categoria: true
    },
    orderBy: { controlNumber: 'asc' }
  });

  const issueDateActual = new Date().toLocaleDateString('es-PR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="bg-white min-h-screen text-black">
      <style>{`
        @media print {
          @page {
            size: letter;
            margin: 0 !important; /* Hides browser default header (date/time) and footer */
          }
          body {
            background-color: #fff !important;
            color: #000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .carta-page {
            padding: 0.6in 0.6in 0.5in 0.6in !important;
            height: 11in !important;
            box-sizing: border-box !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            position: relative !important;
            display: flex !important;
            flex-direction: column !important;
          }
        }
        @media screen {
          .carta-page {
            max-width: 8.5in;
            min-height: 11in;
            margin: 20px auto;
            padding: 0.6in 0.6in 0.5in 0.6in;
            box-sizing: border-box;
            background: #white;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            position: relative;
            display: flex;
            flex-direction: column;
            border: 1px solid #e5e7eb;
          }
        }
      `}</style>
      
      {/* Print Controls (hidden on print) */}
      <BatchPrintHeader count={endosos.length} />

      {endosos.map((endoso, index) => {
        const firmaNombre = endoso.firmanteNombre || 'Shirley Torres Reyes';
        const firmaPuesto = endoso.firmantePuesto || 'Ayudante Especial';
        const firmaExtension = endoso.firmanteExtension || '2133';
        const firmaEmail = endoso.firmanteEmail || 'storres@toabaja.com';

        const rep = (endoso.representante || '').trim();
        const lowerRep = rep.toLowerCase();
        
        let saludo = `Estimado(a) ${rep || endoso.companyName}:`;
        let addresseeLine = rep;

        if (rep === '' || lowerRep === 'representante' || lowerRep === 'representantes' || lowerRep === 'representante autorizado') {
          saludo = `Estimados representantes de ${endoso.companyName}:`;
          addresseeLine = '';
        } else if (lowerRep === 'señores' || lowerRep === 'senores' || lowerRep === 'entidad') {
          saludo = 'Estimados señores:';
          addresseeLine = '';
        } else if (lowerRep.startsWith('sr. ')) {
          saludo = `Estimado señor ${rep.substring(4)}:`;
        } else if (lowerRep.startsWith('sra. ')) {
          saludo = `Estimada señora ${rep.substring(5)}:`;
        } else if (lowerRep.startsWith('srta. ')) {
          saludo = `Estimada señorita ${rep.substring(6)}:`;
        } else if (lowerRep.startsWith('dr. ')) {
          saludo = `Estimado doctor ${rep.substring(4)}:`;
        } else if (lowerRep.startsWith('dra. ')) {
          saludo = `Estimada doctora ${rep.substring(5)}:`;
        } else if (lowerRep.startsWith('ing. ')) {
          saludo = `Estimado ingeniero ${rep.substring(5)}:`;
        } else if (lowerRep.startsWith('inga. ')) {
          saludo = `Estimada ingeniera ${rep.substring(6)}:`;
        } else if (lowerRep.startsWith('lic. ')) {
          saludo = `Estimado licenciado ${rep.substring(5)}:`;
        } else if (lowerRep.startsWith('lica. ')) {
          saludo = `Estimada licenciada ${rep.substring(6)}:`;
        }

        return (
          <div key={endoso.id} className="carta-page font-sans leading-relaxed text-[10.5pt]">
            
            {/* Header / Logos */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col items-center w-40">
                <img src="/images/escudo-toa-baja.png" alt="Escudo Toa Baja" className="w-16 h-auto mb-1" />
                <p className="text-[6pt] text-center leading-tight whitespace-nowrap">Hon. Bernardo "Betito" Márquez García</p>
                <p className="text-[6pt] text-center">Alcalde</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[10.5pt]">Gobierno de Puerto Rico</p>
                <p className="text-[14pt] font-bold text-[#1b5e20]">Municipio Autónomo de Toa Baja</p>
                <p className="text-[10.5pt] italic">Oficina del Alcalde</p>
              </div>
              <div className="w-32 flex justify-end">
                <img src="/images/logo-toa-baja.png" alt="Logo Toa Baja" className="w-24 h-auto" />
              </div>
            </div>

            {/* Date */}
            <div className="mb-3">
              <p>{issueDateActual}</p>
            </div>

            {/* Control Number */}
            <div className="flex justify-end mb-3">
              <div className="border border-[#1b5e20] px-3 py-0.5 text-[9.5pt] font-bold text-[#1b5e20]">
                Núm. Control: {endoso.controlNumber.replace(/-/g, '_')}
              </div>
            </div>

            {/* Addressee */}
            <div className="mb-3 text-[10.5pt] leading-tight">
              {addresseeLine && <p className="font-bold">{addresseeLine}</p>}
              <p className="font-bold">{endoso.companyName}</p>
              <p>{endoso.ubicacion || 'Toa Baja, PR'}</p>
            </div>

            {/* Salutation */}
            <div className="mb-3">
              <p>{saludo}</p>
            </div>

            {/* Body Paragraphs */}
            <div className="space-y-3 text-justify text-[10.5pt] mb-8">
              <p>
                Reciba un cordial saludo de parte de todos los que laboramos en el Municipio de Toa Baja. Hemos recibido su petición para participar en la categoría denominada {endoso.evento?.nombre || 'Evento No Asignado'}, a celebrarse los días {endoso.evento?.fechas || '15, 16 y 17 de mayo de 2026'}, en {endoso.evento?.ubicacion || 'el Balneario de Punta Salinas, Toa Baja, Puerto Rico'}{endoso.tarima ? ` (área adyacente a ${endoso.tarima})` : ''}.
              </p>

              <p>
                El Municipio de Toa Baja ha evaluado su petición y no tiene objeción en que opere (1) quiosco provisional para la venta de <strong>{endoso.descripcion || '[Descripción de venta]'}</strong>. No obstante, el otorgamiento de este endoso está sujeto a que se cumplan con todos los requerimientos establecidos por ley, reglamento u ordenanza en vigor aplicable, así como realizar los trámites correspondientes con el personal de la Oficina de Finanzas Municipales.
              </p>

              <p>
                Igualmente, si su intención es la venta de bebidas alcohólicas, deberá obtener el endoso o licencia correspondiente otorgada por el Departamento de Hacienda para esos fines.
              </p>

              <p>
                Este endoso representa un visto bueno del Municipio en la obtención de cualquier permiso, licencia y/o trámite gubernamental requerido para que el proponente lleve a cabo su propósito.
              </p>

              <p>
                El Municipio interesa mantener el más alto grado de coordination y logística para asegurar que esta categoría tenga el éxito que todos esperamos. Confiamos en que la aportación que usted pueda brindar para el desarrollo de la {endoso.evento?.nombre || 'Evento Especial'} la convierta en un evento que sea considerado por nuestros ciudadanos un verdadero Orgullo Llanero.
              </p>
            </div>

            <div style={{ marginTop: '1.3in', marginBottom: '24px' }}>
              <p style={{ marginBottom: '57px' }}>Cordialmente,</p>
              
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
        );
      })}
    </div>
  );
}
