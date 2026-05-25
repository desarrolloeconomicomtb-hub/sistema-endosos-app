import { prisma } from '@/lib/prisma';
import PrintButton from '@/components/PrintButton';

export default async function ChecklistEndoso({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const endoso = await prisma.endoso.findUnique({ where: { id }});
  if(!endoso) return <div>No encontrado</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb', padding: '2rem' }}>
      <div className="no-print" style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <PrintButton />
      </div>
      
      <div style={{ 
        maxWidth: '850px', 
        margin: '0 auto', 
        padding: '3rem', 
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid black', paddingBottom: '1rem' }}>
          <h2 style={{margin: 0, textTransform: 'uppercase'}}>Hoja de Requisitos y Checklist</h2>
          <h3 style={{margin: 0, fontWeight: 'normal'}}>Endosos Municipales para Kioscos</h3>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
           <div>
             <strong>Solicitante:</strong> {endoso.nombre}<br/>
             <strong>Actividad:</strong> {endoso.actividad}
           </div>
           <div style={{textAlign: 'right'}}>
             <strong>Control:</strong> {endoso.numero_control}<br/>
             <strong>Fecha Radicación:</strong> {endoso.fecha.toLocaleDateString()}
           </div>
        </div>

        <h4 style={{backgroundColor: '#eee', padding: '0.5rem', marginBottom: '1rem'}}>1. Requisitos de Cumplimiento Financiero y Permisos</h4>
        <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '1.1rem', lineHeight: '2' }}>
           <li><input type="checkbox" style={{marginRight: '10px'}} /> Patente Municipal – $25.00</li>
           <li><input type="checkbox" style={{marginRight: '10px'}} /> Permiso de Kiosco – $90.00 (Válido por 3 días)</li>
           <li><input type="checkbox" style={{marginRight: '10px'}} /> Recogido de desperdicios sólidos – $75.00</li>
           <li><input type="checkbox" style={{marginRight: '10px'}} /> Certificación / Carta de bebidas alcohólicas – $50.00 (Si aplica)</li>
           <li><input type="checkbox" style={{marginRight: '10px'}} /> Certificación de Salud – $25.00</li>
           <li><input type="checkbox" style={{marginRight: '10px'}} /> Permiso de Bomberos <em>(Costo varía según tamaño del Kiosco)</em></li>
        </ul>

        <h4 style={{backgroundColor: '#eee', padding: '0.5rem', marginTop: '2rem', marginBottom: '1rem'}}>2. Instrucciones Generales de Seguridad</h4>
        <ul style={{ paddingLeft: '2rem', lineHeight: '1.6' }}>
           <li><strong>Extintores:</strong> Mantener al menos 1 extintor tipo ABC en todo momento en caso de usar fuego.</li>
           <li><strong>Manejo de Gas:</strong> Tanques de gas de 100lbs no están permitidos dentro de la carpa; instalar válvulas de seguridad homologadas.</li>
           <li><strong>Higiene de Alimentos:</strong> Usar redecillas, guantes, y mantener cadena de frío.</li>
           <li><strong>Manejo de Hielo:</strong> Nunca tomar hielo con envases de cristal; utilizar palas higienizadas exclusivas para hielo.</li>
           <li><strong>Disposición de grasa:</strong> Es <strong>estrictamente obligatorio</strong> tener un depósito apropiado para grasas. El vertido ilegal en alcantarillas detendrá la operación inmediatamente.</li>
        </ul>

        <h4 style={{backgroundColor: '#eee', padding: '0.5rem', marginTop: '2rem', marginBottom: '1rem'}}>3. Métodos de Pago y Contactos</h4>
        <p>Los pagos se procesarán en el piso 1 de la Casa Alcaldía en el área de Recaudaciones mediante Efectivo, Cheque de Gerente, o Tarjetas de Crédito / Débito autorizadas.</p>
        
        <div style={{display: 'flex', gap: '2rem', marginTop: '1rem'}}>
           <div style={{flex: 1, padding: '1rem', border: '1px solid #ccc', borderRadius: '8px'}}>
              <strong>Finanzas MTB</strong><br/>
              (787) 261-0202<br/>
              Ext. 2101, 2109, 2203
           </div>
           <div style={{flex: 1, padding: '1rem', border: '1px solid #ccc', borderRadius: '8px'}}>
              <strong>Bomberos de PR (Bayamón)</strong><br/>
              (787) 740-6445<br/>
              Calle Betances #15
           </div>
        </div>
      </div>
    </div>
  )
}
