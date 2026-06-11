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
             <strong>Categoría:</strong> {endoso.categoria?.nombre || 'Comida / Bebida'}
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
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <input type="checkbox" style={{ marginTop: '0.35rem' }} /> 
                    <span>Certificación del Departamento de Salud: <strong style={{ backgroundColor: '#fff599', padding: '0.1rem 0.3rem', borderRadius: '2px' }}>$25.00 por los tres días</strong></span>
                  </li>
                </>
              )}
              
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <input type="checkbox" style={{ marginTop: '0.35rem' }} /> 
                <span>Permiso de Bombero por la actividad (costo según naturaleza y tamaño del negocio).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOMBEROS */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#8a2323', color: 'white', padding: '0.5rem 1rem', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', borderRadius: '4px 4px 0 0' }}>
            REQUISITOS – CUERPO DE BOMBEROS
          </div>
          <div style={{ border: '1px solid #8a2323', borderTop: 'none', padding: '1rem', borderRadius: '0 0 4px 4px' }}>
            <table style={{ w: '100%', width: '100%', borderCollapse: 'collapse', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>TIPO DE ÁREA</th>
                  <th style={{ padding: '0.5rem', width: '80px' }}>3 DÍAS</th>
                  <th style={{ padding: '0.5rem', width: '80px' }}>1-2 DÍAS</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.5rem' }}>Carpa 10 &times; 10 (3 días)</td>
                  <td style={{ padding: '0.5rem', color: '#8a2323', fontWeight: 'bold' }}>$50.00</td>
                  <td style={{ padding: '0.5rem' }}>$20.00</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.5rem' }}>Carpa 20 &times; 20 (3 días)</td>
                  <td style={{ padding: '0.5rem', color: '#8a2323', fontWeight: 'bold' }}>$60.00</td>
                  <td style={{ padding: '0.5rem' }}>&mdash;</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.5rem' }}>Por cada 100 pies² adicionales</td>
                  <td style={{ padding: '0.5rem', color: '#8a2323', fontWeight: 'bold' }}>+$10.00</td>
                  <td style={{ padding: '0.5rem' }}>&mdash;</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.5rem' }}>Tarimas (3 días)</td>
                  <td style={{ padding: '0.5rem', color: '#8a2323', fontWeight: 'bold' }}>$75.00</td>
                  <td style={{ padding: '0.5rem' }}>&mdash;</td>
                </tr>
              </tbody>
            </table>

            <h5 style={{ margin: '1rem 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Requisitos Adicionales de Seguridad:</h5>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', lineHeight: '1.6', color: '#444' }}>
              <li>Completar la hoja de solicitud de servicio y entregarla al menos 5 días antes del evento.</li>
              <li>Comprobante de rentas internas al número de cuenta 5300 (Banco Popular de Puerto Rico o Colecturía).</li>
              <li>Todo kiosco deberá tener un extintor de al menos <strong style={{ color: '#8a2323' }}>5 lbs. ABC fijo a pared</strong> en lugar visible y accesible.</li>
              <li>Los kioscos con tanque de gas deben tener la línea en material flexible. Todo debe estar enroscado.</li>
              <li>Si su mesa es de plástico, deberá tener una plancha de metal debajo de los equipos de cocción.</li>
              <li>La solicitud expedida por el Cuerpo de Bomberos debe colocarse en lugar visible para la inspección.</li>
              <li>Todo kiosco con tanque de gas debe llamar a Murillo Gas: <strong style={{ color: '#8a2323' }}>(787) 324-8166</strong> para certificación e instalación.</li>
            </ul>
          </div>
        </div>

        {/* SALUD */}
        {isComidasBebidas && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ backgroundColor: '#1d4ed8', color: 'white', padding: '0.5rem 1rem', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', borderRadius: '4px 4px 0 0' }}>
              REQUISITOS – DEPARTAMENTO DE SALUD
            </div>
            <div style={{ border: '1px solid #1d4ed8', borderTop: 'none', padding: '1rem', borderRadius: '0 0 4px 4px' }}>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', lineHeight: '1.6', color: '#444' }}>
                <li>Curso de manejo de alimentos (o indicar que tienen conocimiento de este).</li>
                <li>Si es un negocio de mariscos, estos deben estar a temperatura con hielo en todo momento.</li>
                <li>Las personas que atiendan kioscos de alimentos y bebidas deberán utilizar guantes en todo momento.</li>
                <li>Mantener en el kiosco, en todo momento, la solicitud del Departamento de Salud junto con todos los documentos requeridos.</li>
                <li>El hielo destinado para las bebidas deberá mantenerse en una nevera aparte y utilizarse con un "scoop" exclusivo, manteniendo siempre el mango hacia arriba para evitar contaminación.</li>
                <li>Deberá existir un área designada para la disposición adecuada de la grasa.</li>
                <li>Al acudir al Departamento de Salud, deberán presentar el número de control otorgado por el Municipio Autónomo de Toa Baja.</li>
                <li>No se permitirá la sobreocupación de los kioscos.</li>
              </ul>
            </div>
          </div>
        )}

        {/* PIE DE PÁGINA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '3rem', fontSize: '0.75rem', color: '#888' }}>
          <span>{endoso.categoria?.nombre || 'Comida/Bebida'} | {endoso.evento?.nombre || 'Fiestas de la Boulevard 2026'}</span>
          <span>Municipio Autónomo de Toa Baja</span>
        </div>

      </div>
    </div>
  );
}
