import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { changeEndosoStatus } from '@/app/actions/admin';

export default async function EndosoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const endoso = await prisma.endoso.findUnique({ where: { id } });
  
  if (!endoso) return <div className="container" style={{paddingTop: '2rem'}}><h1>Endoso No Encontrado</h1></div>;

  return (
    <main className="container" style={{paddingTop: '2rem', paddingBottom: '4rem'}}>
      <Link href="/dashboard" className="btn-secondary" style={{marginBottom: '2rem', display: 'inline-block'}}>
        &larr; Volver al Dashboard
      </Link>
      
      <div className="card">
        <h1 style={{color: 'var(--mtb-purple)'}}>{endoso.controlNumber}</h1>
        <hr style={{margin: '1rem 0', borderColor: 'var(--border-color)', borderTop: 'none'}} />
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
          <p><strong>Compañía/Negocio:</strong> {endoso.companyName}</p>
          <p><strong>Email:</strong> {endoso.email}</p>
          <p><strong>Teléfono:</strong> {endoso.telefono}</p>
          <p><strong>Dirección:</strong> {endoso.address}</p>
          <p><strong>Ubicación del Evento:</strong> {endoso.ubicacion}</p>
          <p><strong>Fechas del Evento:</strong> {endoso.issueDatesEvento}</p>
          <p><strong>Fecha de Emisión:</strong> {endoso.issueDate.toLocaleDateString()}</p>
          <p>
            <strong>Estado Actual:</strong> 
            <span style={{ 
              fontWeight: 'bold', 
              color: endoso.status === 'Pendiente' ? '#856404' : endoso.status === 'Aprobado' || endoso.status === 'Emitido' ? '#155724' : 'var(--text-main)',
              marginLeft: '0.5rem'
            }}>
              {endoso.status}
            </span>
          </p>
        </div>
      </div>

      {endoso.status === 'Pendiente' && (
        <div className="card" style={{marginTop: '2rem', backgroundColor: '#FFF3CD', border: '1px solid #FFEEBA'}}>
           <p style={{color: '#856404', margin: 0, fontWeight: 'bold'}}>
             ⚠️ "Este endoso debe ser pagado primero en la Oficina de Finanzas antes de continuar el proceso en OGeP o para emitir la carta oficial."
           </p>
        </div>
      )}

      {/* Admin Actions */}
      <div className="card" style={{marginTop: '2rem'}}>
        <h2>Generar Documentos y Acciones</h2>

        <form action={changeEndosoStatus.bind(null, endoso.id)} style={{marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end'}}>
          <div>
             <label htmlFor="status" style={{fontSize: '0.9rem'}}>Cambiar Estado Manualmente:</label>
             <select name="status" id="status" defaultValue={endoso.status} style={{width: '200px', display: 'block'}}>
                <option value="Pendiente">Pendiente</option>
                <option value="Pagado">Pagado en Finanzas</option>
                <option value="Emitido">Emitido</option>
                <option value="Denegado">Denegado</option>
             </select>
          </div>
          <button type="submit" className="btn-secondary">Actualizar Estado</button>
        </form>
      </div>
    </main>
  );
}
