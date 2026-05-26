import { prisma } from '@/lib/prisma';
import PrintButton from '@/components/PrintButton';

export default async function MarbeteEndoso({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const endoso = await prisma.endoso.findUnique({ where: { id }});
  if(!endoso) return <div>No encontrado</div>;

  const isApproved = endoso.status === 'Aprobado';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="no-print" style={{ marginBottom: '1rem', width: '100%', textAlign: 'center' }}>
        <PrintButton />
      </div>
      
      {/* Design of the Marbete */}
      <div style={{ 
        width: '500px', 
        height: '650px',
        backgroundColor: 'var(--mtb-yellow)',
        border: '10px solid var(--mtb-purple)',
        borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{backgroundColor: 'var(--mtb-purple)', color: 'white', padding: '1rem', textAlign: 'center'}}>
          <h2 style={{margin: 0, textTransform: 'uppercase', letterSpacing: '2px'}}>Marbete Oficial MTB</h2>
          <p style={{margin: '0.5rem 0 0 0', opacity: 0.8}}>AUTORIZACIÓN DE KIOSCO</p>
        </div>

        <div style={{padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', backgroundColor: 'white'}}>
           <div style={{textAlign: 'center', marginBottom: '1rem'}}>
             <span style={{fontSize: '0.9rem', color: '#666', textTransform: 'uppercase'}}>Núm. Control</span>
             <h1 style={{margin: '0', fontSize: '2.5rem', color: 'var(--mtb-purple)'}}>{endoso.controlNumber}</h1>
           </div>

           <div>
              <div style={{marginBottom: '1rem'}}>
                <span style={{fontSize: '0.8rem', color: '#666', textTransform: 'uppercase'}}>Entidad / Solicitante</span>
                <p style={{margin: 0, fontSize: '1.2rem', fontWeight: 'bold'}}>{endoso.companyName}</p>
              </div>

              <div style={{marginBottom: '1rem'}}>
                <span style={{fontSize: '0.8rem', color: '#666', textTransform: 'uppercase'}}>Actividad</span>
                <p style={{margin: 0, fontSize: '1.2rem'}}>{endoso.categoriaId}</p>
              </div>

              <div style={{marginBottom: '1rem', display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  <span style={{fontSize: '0.8rem', color: '#666', textTransform: 'uppercase'}}>Tipo de Venta</span>
                  <p style={{margin: 0, fontSize: '1.1rem', fontWeight: 'bold'}}>{endoso.categoriaId}</p>
                </div>
                <div>
                  <span style={{fontSize: '0.8rem', color: '#666', textTransform: 'uppercase'}}>Emisión</span>
                  <p style={{margin: 0, fontSize: '1.1rem'}}>{endoso.issueDate.toLocaleDateString()}</p>
                </div>
              </div>
           </div>

           <div style={{
             backgroundColor: isApproved ? '#D4EDDA' : '#F8D7DA', 
             border: `2px dashed ${isApproved ? '#155724' : '#721C24'}`,
             color: isApproved ? '#155724' : '#721C24',
             padding: '1rem', 
             textAlign: 'center', 
             borderRadius: '8px',
             marginTop: '1rem'
           }}>
             <h2 style={{margin: 0, textTransform: 'uppercase'}}>
               {isApproved ? 'CUMPLE' : 'PENDIENTE'}
             </h2>
           </div>
        </div>

        <div style={{textAlign: 'center', padding: '0.5rem', backgroundColor: '#eee', fontSize: '0.8rem'}}>
          Este documento debe permanecer visible en el kiosco en todo momento.
        </div>
      </div>
    </div>
  )
}
