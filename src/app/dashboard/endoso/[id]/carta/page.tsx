import { prisma } from '@/lib/prisma';
import PrintButton from '@/components/PrintButton';

export default async function CartaEndoso({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const endoso = await prisma.endoso.findUnique({ where: { id }});
  if(!endoso) return <div>No encontrado</div>;

  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Date().toLocaleDateString('es-PR', dateOptions);

  let saludo = 'Estimado/a señor(a):';
  if (endoso.representante === 'Entidad') {
    saludo = 'Estimados señores:';
  } else if (endoso.representante === 'Sr.') {
    saludo = `Estimado señor ${endoso.representante || endoso.companyName}:`;
  } else if (endoso.representante === 'Sra.') {
    saludo = `Estimada señora ${endoso.representante || endoso.companyName}:`;
  } else if (endoso.representante === 'Srta.') {
    saludo = `Estimada señorita ${endoso.representante || endoso.companyName}:`;
  } else if (!endoso.representante && endoso.representante) {
    saludo = `Estimado/a ${endoso.representante}:`;
  }

  return (
    <div className="container" style={{ backgroundColor: '#fff', minHeight: '100vh', padding: '0', maxWidth: '850px', margin: '0 auto', color: '#000' }}>
      <div style={{ padding: '0px 0 20px', display: 'flex', justifyContent: 'flex-end' }} className="no-print">
        <PrintButton />
      </div>

      <div className="printable-document" style={{ padding: '40px 60px', position: 'relative', fontSize: '11pt', fontFamily: '"Times New Roman", Times, serif', lineHeight: '1.5' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          {/* Town Seal and Mayor */}
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
          
          {/* Title block */}
          <div style={{ flex: '1.5', textAlign: 'center', fontSize: '14pt', paddingTop: '15px' }}>
            <div style={{ fontWeight: 'normal', marginBottom: '2px' }}>Gobierno de Puerto Rico</div>
            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Municipio Autónomo de Toa Baja</div>
            <div style={{ fontStyle: 'normal' }}>Oficina del <span style={{ textDecoration: 'underline' }}>Alcalde</span></div>
          </div>
          
          {/* Llanero Logo */}
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
          <div style={{ fontWeight: 'bold' }}>{endoso.representante && endoso.representante !== 'Entidad' ? endoso.representante : ''} {endoso.companyName} {endoso.representante || ''}</div>
          <div>{endoso.address}</div>
          <div>Toa Baja, PR 00949</div>
        </div>

        {/* Salutation */}
        <div style={{ marginBottom: '20px' }}>
          {saludo}
        </div>

        {/* Body Paragraphs */}
        <div style={{ textAlign: 'justify', marginBottom: '15px' }}>
          Reciba un cordial saludo de parte de todos los que laboramos en el Municipio de Toa Baja. Hemos recibido su petición para participar en la categoriaId nominada <strong>{endoso.categoriaId}</strong> a efectuarse en los predios de {endoso.ubicacion}{endoso.tarima ? `, específicamente en la tarima o área designada como: ${endoso.tarima}` : ''}.
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '15px' }}>
          El Municipio de Toa Baja ha evaluado su petición y no tiene objeción en que opere un (1) quiosco provisional para la venta de <strong>{endoso.categoriaId}</strong>. No obstante, el otorgamiento de este endoso está sujeto a que se cumplan con todos los requerimientos establecidos por ley, reglamento u ordenanza en vigor aplicable y realizar los trámites con el personal de la Oficina de Finanzas Municipales. Igualmente, si su intención es la venta de bebidas alcohólicas deberá obtener el endoso o licencia correspondiente otorgada por el Departamento de Hacienda para esos fines.
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '15px' }}>
          Este endoso representa un visto bueno del Municipio en la obtención de cualquier permiso, licencia y/o tramite gubernamental, requerido para que el proponente lleve a cabo su propósito.
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '30px' }}>
          El Municipio interesa mantener el más alto grado de coordinación y logística para asegurar que esta categoriaId tenga el éxito que todos esperamos. Confiamos en que la aportación que usted pueda brindar para el desarrollo de <strong>{endoso.categoriaId}</strong> las convierta en un evento que sea considerado por nuestros ciudadanos un Orgullo Llanero.
        </div>

        {/* Closing */}
        <div style={{ marginBottom: '50px' }}>
          Cordialmente,
        </div>

        {/* Signature */}
        <div style={{ marginTop: '50px' }}>
          <div style={{ fontWeight: 'bold' }}>{endoso.firmante_companyName || 'Shirley Torres Reyes'}</div>
          <div>{endoso.firmante_puesto || 'Ayudante Especial'}</div>
        </div>

        {/* Footer */}
        <footer style={{ position: 'absolute', bottom: '20px', left: '40px', right: '40px', borderTop: '1px solid #000', paddingTop: '10px', fontSize: '7pt', textAlign: 'center', color: '#333' }}>
          Dirección: Apartado 2359, Toa Baja, P.R. 00951 &nbsp;&nbsp;•&nbsp;&nbsp;
          Teléfono: (787) 261-0202 &nbsp;&nbsp;•&nbsp;&nbsp;
          Extensión: 2133 &nbsp;&nbsp;•&nbsp;&nbsp;
          Correo Electrónico: storres@toabaja.com
        </footer>
      </div>
    </div>
  );
}
