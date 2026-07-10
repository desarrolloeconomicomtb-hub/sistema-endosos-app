import { prisma } from '@/lib/prisma';
import PrintButton from '@/components/PrintButton';

export default async function ChecklistEndoso({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const endoso = await prisma.endoso.findUnique({ 
    where: { id },
    include: { categoria: true, evento: true }
  });
  if(!endoso) return <div className="p-8 text-center">No encontrado</div>;

  const isComidasBebidas = endoso.categoriaId === 'comidas_bebidas' || (endoso.categoria?.nombre || '').toLowerCase().includes('comida');

  const rawRecibos = [endoso.reciboPatente, endoso.reciboAmbulante, endoso.reciboBebidas]
    .filter(Boolean) as string[];
  const cleanRecibosList = rawRecibos
    .flatMap(r => r.split(/[\/\s,]+/))
    .map(num => num.trim())
    .filter(Boolean);
  const recibosSeparados = cleanRecibosList.join(' ');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }} className="min-h-screen bg-gray-100 p-8">
      <div className="no-print flex justify-center gap-4 mb-6">
        <PrintButton />
      </div>
      
      <div style={{ 
        maxWidth: '850px', 
        margin: '0 auto', 
        padding: '3rem', 
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }} className="bg-white rounded-lg shadow-md max-w-3xl mx-auto p-12">
        
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #2e5e2e', paddingBottom: '1rem' }}>
          <h2 style={{ margin: 0, textTransform: 'uppercase', color: '#1b3d1b', fontSize: '1.5rem', fontWeight: 'bold' }}>Hoja de Requisitos y Checklist de Cotejo</h2>
          <h3 style={{ margin: '0.25rem 0 0 0', fontWeight: 'normal', fontSize: '1.1rem', color: '#555' }}>
            {endoso.evento?.nombre || 'Fiestas de la Boulevard 2026'}
          </h3>
        </div>
        
        {/* Información del Comercio */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.9rem' }}>
           <div>
             <strong>Comercio/Negocio:</strong> {endoso.companyName}<br/>
             <strong>Representante:</strong> {endoso.representante || 'N/A'}<br/>
             <strong>Categoría:</strong> {endoso.categoria?.nombre || 'Comida / Bebida'}<br/>
             <strong>Recibos de Pago:</strong> {endoso.exentoPago ? `EXENTO ${endoso.exentoRazon ? `(${endoso.exentoRazon})` : ''}` : (recibosSeparados || 'N/A')}
           </div>
           <div>
             <strong>Número de Control:</strong> {endoso.controlNumber}<br/>
             <strong>Tarima / Ubicación:</strong> {endoso.tarima || 'Sin Tarima asignada'}<br/>
             <strong>Fecha Radicación:</strong> {new Date(endoso.issueDate).toLocaleDateString('es-PR')}
           </div>
        </div>

        {/* REQUISITOS GENERALES */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#2e5e2e', color: 'white', padding: '0.5rem 1rem', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'center' }}>
            REQUISITOS GENERALES {isComidasBebidas ? '– KIOSCOS DE VENTA DE BEBIDA / ALCOHOL / COMIDA' : ''}
          </div>
          <div style={{ border: '1px solid #2e5e2e', borderTop: 'none', padding: '1rem', borderRadius: '0 0 4px 4px' }}>
            <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, fontSize: '0.95rem', lineHeight: '2' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <input type="checkbox" style={{ marginTop: '0.35rem' }} /> 
                <span>Endoso de la persona encargada de la tarima.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <input type="checkbox" style={{ marginTop: '0.35rem' }} /> 
                <span>Patente Municipal por el evento: <strong style={{ backgroundColor: '#fff599', padding: '0.1rem 0.3rem', borderRadius: '2px' }}>$25.00</strong></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <input type="checkbox" style={{ marginTop: '0.35rem' }} /> 
                <span>Permiso para instalación y operación de kioscos (válido por los 3 días): <strong style={{ backgroundColor: '#fff599', padding: '0.1rem 0.3rem', borderRadius: '2px' }}>$30.00/día &rarr; Total: $90.00</strong></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <input type="checkbox" style={{ marginTop: '0.35rem' }} /> 
                <span>Recogido de desperdicios sólidos (válido por los 3 días): <strong style={{ backgroundColor: '#fff599', padding: '0.1rem 0.3rem', borderRadius: '2px' }}>$25.00/día &rarr; Total: $75.00</strong></span>
              </li>
              
              {isComidasBebidas && (
                <>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <input type="checkbox" style={{ marginTop: '0.35rem' }} /> 
                    <span>Carta de endoso para bebidas alcohólicas (Oficina del Alcalde o Vicealcalde): <strong style={{ backgroundColor: '#fff599', padding: '0.1rem 0.3rem', borderRadius: '2px' }}>$50.00</strong></span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', paddingLeft: '1.5rem', fontSize: '0.85rem', color: '#555', fontStyle: 'italic' }}>
                    <span>&mdash; Este endoso debe ser pagado primero en la Oficina de Finanzas. Luego deberá llenar la solicitud de OGPe, lo cual le dará acceso al endoso correspondiente.</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* PIE DE PÁGINA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '3rem', fontSize: '0.75rem', color: '#888' }}>
          <span>{endoso.categoria?.nombre || 'Comida/Bebida'} | {endoso.evento?.nombre || 'Fiestas de la Boulevard 2026'}</span>
          <span>Municipio Autónomo de Toa Baja</span>
        </div>

      </div>
    </div>
  );
}
