import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import PrintButton from '@/components/PrintButton';

export const dynamic = 'force-dynamic';

export default async function ReportesPage() {
  const endosos = await prisma.endoso.findMany({
    include: {
      evento: true,
      categoria: true,
    },
    orderBy: { issueDate: 'desc' }
  });

  const totales = endosos.length;
  
  // Agrupar por Categorías
  const categoriaCounts: Record<string, number> = {};
  endosos.forEach(e => {
    const catName = e.categoria?.nombre || 'Sin Categoría';
    categoriaCounts[catName] = (categoriaCounts[catName] || 0) + 1;
  });

  // Agrupar por Estado
  const statusCounts: Record<string, number> = {};
  endosos.forEach(e => {
    statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
  });

  // Agrupar por Evento
  const eventoCounts: Record<string, number> = {};
  endosos.forEach(e => {
    const evName = e.evento?.nombre || 'Sin Evento';
    eventoCounts[evName] = (eventoCounts[evName] || 0) + 1;
  });

  // Group full endosos by Evento for the detailed breakdown
  const endososPorEvento = endosos.reduce((acc, endoso) => {
    const evName = endoso.evento?.nombre || 'Sin Evento';
    if (!acc[evName]) acc[evName] = [];
    acc[evName].push(endoso);
    return acc;
  }, {} as Record<string, typeof endosos>);

  const currentDate = new Date().toLocaleDateString('es-PR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="container" style={{padding: '2rem 1rem'}}>
      <div className="no-print" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
        <Link href="/dashboard" className="btn-secondary">&larr; Volver al Dashboard</Link>
        <PrintButton />
      </div>

      <div className="card" style={{ backgroundColor: '#fff', color: '#000', padding: '3rem' }}>
        <header style={{textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid #000', paddingBottom: '1rem'}}>
           <h1 style={{margin: 0, textTransform: 'uppercase', fontSize: '1.8rem'}}>Informe Ejecutivo de Endosos</h1>
           <p style={{margin: '5px 0 0 0', fontStyle: 'italic', fontSize: '1.2rem'}}>Municipio Autónomo de Toa Baja</p>
           <p style={{margin: '5px 0 0 0', fontSize: '0.9rem', color: '#555'}}>Generado el: {currentDate}</p>
        </header>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem'}}>
           
           {/* Resumen Global */}
           <div style={{border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fafafa'}}>
             <h3 style={{marginTop: 0, color: '#333'}}>Total Registrados</h3>
             <div style={{fontSize: '3rem', fontWeight: 'bold', color: '#2e5e2e'}}>{totales}</div>
           </div>

           {/* Estatus */}
           <div style={{border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#fafafa'}}>
             <h3 style={{marginTop: 0, color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem'}}>Estatus</h3>
             <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
               {Object.entries(statusCounts).sort((a,b)=>b[1]-a[1]).map(([k, v]) => (
                 <li key={k} style={{display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0'}}>
                   <span>{k}</span>
                   <strong style={{fontSize: '1.2rem'}}>{v}</strong>
                 </li>
               ))}
             </ul>
           </div>

           {/* Categorías */}
           <div style={{border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#fafafa'}}>
             <h3 style={{marginTop: 0, color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem'}}>Categorías</h3>
             <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
               {Object.entries(categoriaCounts).sort((a,b)=>b[1]-a[1]).map(([k, v]) => (
                 <li key={k} style={{display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0'}}>
                   <span>{k}</span>
                   <strong style={{fontSize: '1.2rem'}}>{v}</strong>
                 </li>
               ))}
             </ul>
           </div>
        </div>

        {/* Desglose por Evento */}
        <div style={{marginBottom: '3rem'}}>
           <h3 style={{borderBottom: '2px solid #000', paddingBottom: '0.5rem', color: '#111'}}>Resumen por Evento</h3>
           <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem'}}>
             <thead>
               <tr style={{backgroundColor: '#eee', borderBottom: '2px solid #ccc'}}>
                 <th style={{padding: '0.75rem', textAlign: 'left', color: '#000'}}>Nombre del Evento</th>
                 <th style={{padding: '0.75rem', textAlign: 'center', color: '#000'}}>Cantidad de Endosos</th>
               </tr>
             </thead>
             <tbody>
                 {Object.entries(eventoCounts).sort((a,b)=>b[1]-a[1]).map(([k, v], i) => (
                   <tr key={i} style={{borderBottom: '1px solid #ddd'}}>
                     <td style={{padding: '0.75rem', textAlign: 'left'}}>{k}</td>
                     <td style={{padding: '0.75rem', textAlign: 'center', fontWeight: 'bold'}}>{v}</td>
                   </tr>
                 ))}
             </tbody>
           </table>
        </div>

        {/* Registro Detallado Agrupado por Evento */}
        <div style={{pageBreakBefore: 'auto'}}>
           <h3 style={{borderBottom: '2px solid #000', paddingBottom: '0.5rem', color: '#111'}}>Registro Detallado por Evento</h3>
           
           {Object.keys(endososPorEvento).sort().map(evName => {
             const lista = endososPorEvento[evName];
             return (
               <div key={evName} style={{ marginBottom: '2rem' }}>
                 <h4 style={{ backgroundColor: '#e2e8f0', padding: '0.5rem 1rem', borderRadius: '4px', margin: '0 0 1rem 0', fontWeight: 'bold' }}>
                   📍 Evento: {evName} ({lista.length} solicitudes)
                 </h4>
                 <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem'}}>
                   <thead>
                     <tr style={{borderBottom: '2px solid #ccc'}}>
                       <th style={{padding: '0.5rem', textAlign: 'left', color: '#000'}}>Núm. Control</th>
                       <th style={{padding: '0.5rem', textAlign: 'left', color: '#000'}}>Solicitante</th>
                       <th style={{padding: '0.5rem', textAlign: 'left', color: '#000'}}>Categoría</th>
                       <th style={{padding: '0.5rem', textAlign: 'left', color: '#000'}}>Estatus</th>
                     </tr>
                   </thead>
                   <tbody>
                      {lista.map(e => {
                        const esPagado = e.status === 'Pagado' || e.status === 'Aprobado';
                        return (
                          <tr key={e.id} style={{borderBottom: '1px solid #ddd'}}>
                            <td style={{padding: '0.5rem'}}>{e.controlNumber}</td>
                            <td style={{padding: '0.5rem'}}>{e.companyName}</td>
                            <td style={{padding: '0.5rem'}}>{e.categoria?.nombre || 'Sin Categoría'}</td>
                            <td style={{padding: '0.5rem', fontWeight: esPagado ? 'bold':'normal', color: esPagado ? '#155724' : '#856404'}}>
                              {e.status}
                            </td>
                          </tr>
                        );
                      })}
                   </tbody>
                 </table>
               </div>
             );
           })}
        </div>

      </div>
    </main>
  );
}
