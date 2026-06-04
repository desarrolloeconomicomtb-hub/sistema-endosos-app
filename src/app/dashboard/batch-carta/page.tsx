import { prisma } from '@/lib/prisma';
import PrintButton from '@/components/PrintButton';

export default async function BatchCartaEndoso({ searchParams }: { searchParams: Promise<{ ids?: string | string[] }> }) {
  const resolvedParams = await searchParams;
  const idArray = Array.isArray(resolvedParams.ids) ? resolvedParams.ids : (resolvedParams.ids ? [resolvedParams.ids] : []);
  
  if (idArray.length === 0) {
    return <div className="container" style={{padding: '2rem'}}><h1>No se seleccionaron endosos para imprimir.</h1></div>;
  }

  const endosos = await prisma.endoso.findMany({ 
    where: { id: { in: idArray } },
    include: {
      evento: true,
      categoria: true
    },
    orderBy: { controlNumber: 'asc' }
  });

  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Date().toLocaleDateString('es-PR', dateOptions);

  return (
    <div className="container" style={{ backgroundColor: '#fff', minHeight: '100vh', padding: '0', maxWidth: '850px', margin: '0 auto', color: '#000' }}>
      <style>{`
        @media print {
          body {
            background-color: #fff !important;
            color: #000 !important;
          }
          .no-print {
            display: none !important;
          }
          .printable-document {
            padding: 0.35in 0.5in 0.4in 0.5in !important;
            font-size: 10.5pt !important;
            line-height: 1.4 !important;
          }
          header {
            margin-bottom: 25px !important;
          }
          .content-block {
            margin-bottom: 20px !important;
          }
          .footer-box {
            position: absolute !important;
            bottom: 10px !important;
            left: 0.5in !important;
            right: 0.5in !important;
          }
          @page {
            size: letter;
            margin: 0.4in 0.4in 0.3in 0.4in;
          }
        }
      `}</style>
      
      <div style={{ padding: '20px 0 10px', display: 'flex', justifyContent: 'flex-end', position: 'sticky', top: 0, background: '#fff', zIndex: 100 }} className="no-print">
        <div style={{ marginRight: 'auto', padding: '10px 20px', fontWeight: 'bold' }}>Imprimiendo {endosos.length} documento(s)</div>
        <PrintButton />
      </div>

      {endosos.map((endoso, index) => {
        const rep = (endoso.representante || '').trim();
        const lowerRep = rep.toLowerCase();
        
        let saludo = `Estimado(a) ${rep || endoso.companyName}:`;
        let addresseeLine = rep;

        // Custom salutation logic based on representative name
        if (rep === '' || lowerRep === 'representante' || lowerRep === 'representantes' || lowerRep === 'representante autorizado') {
          saludo = `Estimados representantes de ${endoso.companyName}:`;
          addresseeLine = '';
        } else if (lowerRep === 'señores' || lowerRep === 'senores' || lowerRep === 'entidad') {
          saludo = 'Estimados señores:';
          addresseeLine = '';
        } else if (lowerRep.startsWith('sr. ')) {
          saludo = `Estimado señor ${rep.substring(4).split(' ')[0]}:`;
        } else if (lowerRep.startsWith('sra. ')) {
          saludo = `Estimada señora ${rep.substring(5).split(' ')[0]}:`;
        } else if (lowerRep.startsWith('srta. ')) {
          saludo = `Estimada señorita ${rep.substring(6).split(' ')[0]}:`;
        } else if (lowerRep.startsWith('dr. ')) {
          saludo = `Estimado doctor ${rep.substring(4).split(' ')[0]}:`;
        } else if (lowerRep.startsWith('dra. ')) {
          saludo = `Estimada doctora ${rep.substring(5).split(' ')[0]}:`;
        } else if (lowerRep.startsWith('ing. ')) {
          saludo = `Estimado ingeniero ${rep.substring(5).split(' ')[0]}:`;
        } else if (lowerRep.startsWith('inga. ')) {
          saludo = `Estimada ingeniera ${rep.substring(6).split(' ')[0]}:`;
        } else if (lowerRep.startsWith('lic. ')) {
          saludo = `Estimado licenciado ${rep.substring(5).split(' ')[0]}:`;
        } else if (lowerRep.startsWith('lica. ')) {
          saludo = `Estimada licenciada ${rep.substring(6).split(' ')[0]}:`;
        }

        // Dynamic office title based on firmante role
        let oficinaTitle = "Oficina del Alcalde";
        if (endoso.firmantePuesto) {
          if (endoso.firmantePuesto.toLowerCase().includes("vicealcalde")) {
            oficinaTitle = "Oficina del Vicealcalde";
          } else if (endoso.firmantePuesto.toLowerCase().includes("ayudante")) {
            oficinaTitle = "Oficina del Alcalde";
          } else {
            oficinaTitle = `Oficina del ${endoso.firmantePuesto}`;
          }
        }

        return (
          <div key={endoso.id} className="printable-document" style={{ 
            padding: '40px 60px', 
            position: 'relative', 
            fontSize: '10.5pt', 
            fontFamily: '"Times New Roman", Times, serif', 
            lineHeight: '1.45',
            pageBreakAfter: index === endosos.length - 1 ? 'auto' : 'always',
            minHeight: '1040px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '35px' }}>
              {/* Town Seal and Mayor */}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <img 
                   src="/escudo.png" 
                   alt="Escudo de Toa Baja" 
                   style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '5px' }}
                />
                <div style={{ fontSize: '8pt', color: '#000', lineHeight: '1.2', fontWeight: '500' }}>
                   Hon. Bernardo &quot;Betito&quot; Márquez García<br />
                   <span style={{ fontStyle: 'italic' }}>Alcalde</span>
                </div>
              </div>
              
              {/* Title block */}
              <div style={{ flex: '1.8', textAlign: 'center', fontSize: '12pt', paddingTop: '10px' }}>
                <div style={{ fontWeight: 'normal', marginBottom: '1px' }}>Gobierno de Puerto Rico</div>
                <div style={{ fontWeight: 'bold', marginBottom: '1px', fontSize: '13pt' }}>Municipio Autónomo de Toa Baja</div>
                <div style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{oficinaTitle}</div>
              </div>
              
              {/* Llanero Logo */}
              <div style={{ flex: '1', display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
                 <img 
                   src="/logo-llanero.png" 
                   alt="Orgullo Llanero" 
                   style={{ width: '110px', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            </header>

            {/* Date and Content Area */}
            <div style={{ flex: 'none' }}>
              {/* Date */}
              <div style={{ marginBottom: '25px', fontSize: '10.5pt' }}>
                {formattedDate}
              </div>

              {/* Addressee */}
              <div style={{ marginBottom: '25px', lineHeight: '1.2' }}>
                {addresseeLine && <div style={{ fontWeight: 'bold' }}>{addresseeLine}</div>}
                <div style={{ fontWeight: 'bold' }}>{endoso.companyName}</div>
                {endoso.address && <div>{endoso.address}</div>}
                <div>Toa Baja, PR 00949</div>
              </div>

              {/* Salutation */}
              <div style={{ marginBottom: '18px', fontWeight: 'bold' }}>
                {saludo}
              </div>

              {/* Body Paragraphs */}
              <div style={{ textAlign: 'justify', marginBottom: '15px', textIndent: '0px' }}>
                Reciba un cordial saludo de parte del Municipio Autónomo de Toa Baja. Hemos evaluado la solicitud de <strong>{endoso.companyName}</strong> para formar parte de la actividad <strong>&quot;{endoso.evento.nombre}&quot;</strong>, organizada por el <strong>Municipio Autónomo de Toa Baja</strong>. Este evento se llevará a cabo el <strong>{endoso.fechasEvento}</strong>.
              </div>

              <div style={{ textAlign: 'justify', marginBottom: '15px' }}>
                El Municipio no tiene objeción en que su negocio opere un quiosco provisional para la venta de <strong>{endoso.categoria.nombre.toLowerCase()}</strong> en la actividad mencionada. No obstante, el otorgamiento de este endoso está sujeto a que se cumplan con todos los requisitos establecidos por ley, reglamento u ordenanza. Igualmente, deberá realizar los trámites correspondientes con el personal de la Oficina de Finanzas Municipales respecto a cualquier aspecto requerido por ley, reglamentos u ordenanzas aplicables.
              </div>

              <div style={{ textAlign: 'justify', marginBottom: '25px' }}>
                El Municipio se compromete a mantener el más alto nivel de coordinación y logística para asegurar el éxito del evento. Confiamos en que la participación de su negocio contribuirá al desarrollo de esta actividad y la convertirá en una experiencia memorable para nuestra comunidad.
              </div>

              {/* Closing */}
              <div style={{ marginTop: '40px', marginBottom: '60px', marginLeft: '80px' }}>
                Cordialmente,
              </div>

              {/* Signature */}
              <div style={{ marginTop: '0px', marginLeft: '80px' }}>
                <div style={{ fontWeight: 'bold' }}>{endoso.firmanteNombre || 'Shirley Torres Reyes'}</div>
                <div>{endoso.firmantePuesto || 'Ayudante Especial'}</div>
              </div>
            </div>

            {/* Footer in a clean box */}
            <footer className="footer-box" style={{ 
              border: '1px solid #d1d5db', 
              padding: '6px 10px', 
              fontSize: '7.5pt', 
              textAlign: 'center', 
              color: '#000',
              marginTop: 'auto',
              backgroundColor: '#fff',
              fontFamily: 'Arial, sans-serif'
            }}>
              Dirección: Apartado 2359, Toa Baja, P.R. 00951 &nbsp;&nbsp;|&nbsp;&nbsp;
              Teléfono: (787) 261-0202 &nbsp;&nbsp;|&nbsp;&nbsp;
              Extensiones: {endoso.firmanteExtension || '2133'} &nbsp;&nbsp;|&nbsp;&nbsp;
              Correo Electrónico: {endoso.firmanteEmail || 'storres@toabaja.com'}
            </footer>
          </div>
        );
      })}
    </div>
  );
}
