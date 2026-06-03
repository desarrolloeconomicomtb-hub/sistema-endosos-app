import { prisma } from '@/lib/prisma';
import PrintAction from '../[id]/print/PrintAction';

export const dynamic = "force-dynamic";

export default async function PrintAllCartasPage(props: { searchParams: Promise<{ eventoId?: string }> }) {
  const searchParams = await props.searchParams;
  const eventoId = searchParams.eventoId;

  // Query all endosos matching the event
  const endosos = await prisma.endoso.findMany({
    where: eventoId ? { eventoId } : undefined,
    include: {
      evento: true,
      categoria: true,
    },
    orderBy: { controlNumber: 'asc' }
  });

  if (endosos.length === 0) {
    return <div className="p-10 text-center font-bold text-xl">No hay endosos registrados para generar cartas.</div>;
  }

  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Date().toLocaleDateString('es-PR', dateOptions);

  return (
    <div className="bg-white min-h-screen text-black p-0 max-w-[850px] mx-auto font-serif">
      <div className="flex justify-end p-4 sticky top-0 bg-white z-10 print:hidden border-b border-gray-100">
        <span className="mr-auto font-bold flex items-center">Imprimiendo {endosos.length} cartas(s)</span>
        <PrintAction />
      </div>

      {endosos.map((endoso, index) => {
        const rep = (endoso.representante || '').trim();
        const lowerRep = rep.toLowerCase();
        
        let saludo = `Estimado(a) ${rep}:`;
        let addresseeLine = rep;

        if (rep === '' || lowerRep === 'representante' || lowerRep === 'representantes' || lowerRep === 'representante autorizado') {
          saludo = `Estimados representantes de ${endoso.companyName}:`;
          addresseeLine = ''; // Do not print placeholder line
        } else if (lowerRep === 'señores' || lowerRep === 'senores') {
          saludo = 'Estimados señores:';
          addresseeLine = 'Señores';
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
        }

        return (
          <div key={endoso.id} className="printable-document" style={{ 
            padding: '40px 60px', 
            position: 'relative', 
            fontSize: '11pt', 
            fontFamily: '"Times New Roman", Times, serif', 
            lineHeight: '1.5',
            pageBreakAfter: index === endosos.length - 1 ? 'auto' : 'always',
            minHeight: '1040px'
          }}>
            
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <img 
                   src="/escudo.png" 
                   alt="Escudo de Toa Baja" 
                   style={{ width: '90px', height: '90px', objectFit: 'contain', marginBottom: '5px' }}
                />
                <div style={{ fontSize: '9pt', color: '#000', lineHeight: '1.2' }}>
                   Hon. Bernardo &quot;Betito&quot; Márquez García<br />
                   <span style={{ fontStyle: 'italic' }}>Alcalde</span>
                </div>
              </div>
              
              <div style={{ flex: '1.5', textAlign: 'center', fontSize: '14pt', paddingTop: '15px' }}>
                <div style={{ fontWeight: 'normal', marginBottom: '2px' }}>Gobierno de Puerto Rico</div>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Municipio Autónomo de Toa Baja</div>
                <div>Oficina del Alcalde</div>
              </div>
              
              <div style={{ flex: '1', display: 'flex', justifyContent: 'center', paddingTop: '15px' }}>
                 <img 
                   src="/logo-llanero.png" 
                   alt="Orgullo Llanero" 
                   style={{ width: '130px', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            </header>

            {/* Date and Control Number */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div>{formattedDate}</div>
              <div style={{ border: '1px solid #000', padding: '4px 10px', fontWeight: 'bold' }}>
                Núm. Control: {endoso.controlNumber.replace(/-/g, ' ')}
              </div>
            </div>

            {/* Addressee */}
            <div style={{ marginBottom: '30px', lineHeight: '1.2' }}>
              {addresseeLine && (
                <div style={{ fontWeight: 'bold' }}>{addresseeLine}</div>
              )}
              <div style={{ fontWeight: 'bold' }}>{endoso.companyName}</div>
              <div>{endoso.address || ''}</div>
              <div>Toa Baja, PR 00949</div>
            </div>

            {/* Salutation */}
            <div style={{ marginBottom: '20px' }}>
              {saludo}
            </div>

            {/* Body Paragraphs */}
            <div style={{ textAlign: 'justify', marginBottom: '15px' }}>
              Reciba un cordial saludo de parte de todos los que laboramos en el Municipio de Toa Baja. Hemos recibido su petición para participar en la categoría nominada <strong>{endoso.categoria?.nombre || 'Sin Categoría'}</strong> a efectuarse en los predios de {endoso.ubicacion}{endoso.tarima ? ` (área adyacente a ${endoso.tarima})` : ''}.
            </div>

            <div style={{ textAlign: 'justify', marginBottom: '15px' }}>
              El Municipio de Toa Baja ha evaluado su petición y no tiene objeción en que opere un (1) quiosco provisional para la venta de <strong>{endoso.categoria?.nombre || 'Sin Categoría'}</strong>. No obstante, el otorgamiento de este endoso está sujeto a que se cumplan con todos los requerimientos establecidos por ley, reglamento u ordenanza en vigor aplicable y realizar los trámites con el personal de la Oficina de Finanzas Municipales. Igualmente, si su intención es la venta de bebidas alcohólicas deberá obtener el endoso o licencia correspondiente otorgada por el Departamento de Hacienda para esos fines.
            </div>

            <div style={{ textAlign: 'justify', marginBottom: '15px' }}>
              Este endoso representa un visto bueno del Municipio en la obtención de cualquier permiso, licencia y/o tramite gubernamental, requerido para que el proponente lleve a cabo su propósito.
            </div>

            <div style={{ textAlign: 'justify', marginBottom: '30px' }}>
              El Municipio interesa mantener el más alto grado de coordinación y logística para asegurar que esta categoría tenga el éxito que todos esperamos. Confiamos en que la aportación que usted pueda brindar para el desarrollo de <strong>{endoso.categoria?.nombre || 'Sin Categoría'}</strong> las convierta en un evento que sea considerado por nuestros ciudadanos un Orgullo Llanero.
            </div>

            {/* Closing */}
            <div style={{ marginBottom: '50px' }}>
              Cordialmente,
            </div>

            {/* Signature */}
            <div style={{ marginTop: '50px' }}>
              <div style={{ fontWeight: 'bold' }}>{endoso.firmanteNombre || 'Shirley Torres Reyes'}</div>
              <div>{endoso.firmantePuesto || 'Ayudante Especial'}</div>
            </div>

            {/* Footer */}
            <footer style={{ position: 'absolute', bottom: '20px', left: '40px', right: '40px', borderTop: '1px solid #000', paddingTop: '10px', fontSize: '7pt', textAlign: 'center', color: '#333' }}>
              Dirección: Apartado 2359, Toa Baja, P.R. 00951 &nbsp;&nbsp;•&nbsp;&nbsp;
              Teléfono: (787) 261-0202 &nbsp;&nbsp;•&nbsp;&nbsp;
              Extensión: {endoso.firmanteExtension || '2133'} &nbsp;&nbsp;•&nbsp;&nbsp;
              Correo Electrónico: {endoso.firmanteEmail || 'storres@toabaja.com'}
            </footer>
          </div>
        );
      })}
    </div>
  );
}
