import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { changeEndosoStatus, updateFirmante } from '@/app/actions/admin';

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
        <h1 style={{color: 'var(--mtb-purple)'}}>{endoso.numero_control}</h1>
        <hr style={{margin: '1rem 0', borderColor: 'var(--border-color)', borderTop: 'none'}} />
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
          <p><strong>Solicitante:</strong> {endoso.titulo && endoso.titulo !== 'Entidad' ? endoso.titulo : ''} {endoso.nombre} {endoso.apellidos || ''}</p>
          <p><strong>Email:</strong> {endoso.email}</p>
          <p><strong>Teléfono:</strong> {endoso.telefono}</p>
          <p><strong>Dirección:</strong> {endoso.direccion}</p>
          <p><strong>Actividad:</strong> {endoso.actividad}</p>
          <p><strong>Ubicación:</strong> {endoso.ubicacion}</p>
          <p><strong>Tipo Venta:</strong> {endoso.tipo_venta}</p>
          <p><strong>Fecha de Radicación:</strong> {endoso.fecha.toLocaleDateString()}</p>
          <p>
            <strong>Estado Actual:</strong> 
            <span style={{ 
              fontWeight: 'bold', 
              color: endoso.estado === 'Pendiente' ? '#856404' : endoso.estado === 'Aprobado' || endoso.estado === 'Pagado' ? '#155724' : 'var(--text-main)',
              marginLeft: '0.5rem'
            }}>
              {endoso.estado}
            </span>
          </p>
        </div>
      </div>

      {endoso.estado === 'Pendiente' && (
        <div className="card" style={{marginTop: '2rem', backgroundColor: '#FFF3CD', border: '1px solid #FFEEBA'}}>
           <p style={{color: '#856404', margin: 0, fontWeight: 'bold'}}>
             ⚠️ "Este endoso debe ser pagado primero en la Oficina de Finanzas antes de continuar el proceso en OGeP o para emitir la carta oficial."
           </p>
        </div>
      )}

      {/* Admin Actions */}
      <div className="card" style={{marginTop: '2rem'}}>
        <h2>Generar Documentos y Acciones</h2>
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem'}}>
          <Link href={`/dashboard/endoso/${endoso.id}/carta`} className="btn-primary" target="_blank">
            Generar Carta (PDF/Print)
          </Link>
          <Link href={`/dashboard/endoso/${endoso.id}/checklist`} className="btn-primary" target="_blank">
            Generar Checklist
          </Link>
          <Link href={`/dashboard/endoso/${endoso.id}/marbete`} className="btn-primary" target="_blank">
            Generar Marbete
          </Link>
        </div>

        <form action={changeEndosoStatus.bind(null, endoso.id)} style={{marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end'}}>
          <div>
             <label htmlFor="estado" style={{fontSize: '0.9rem'}}>Cambiar Estado Manualmente:</label>
             <select name="estado" id="estado" defaultValue={endoso.estado} style={{width: '200px', display: 'block'}}>
                <option value="Pendiente">Pendiente</option>
                <option value="Pagado">Pagado en Finanzas</option>
                <option value="Aprobado">Aprobado / Emitido</option>
                <option value="Denegado">Denegado</option>
             </select>
          </div>
          <button type="submit" className="btn-secondary">Actualizar Estado</button>
        </form>

        <hr style={{margin: '2rem 0', borderColor: 'var(--border-color)', borderTop: 'none'}} />

        <form action={updateFirmante.bind(null, endoso.id)} style={{display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap'}}>
          <div>
             <label htmlFor="firmante_nombre" style={{fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem'}}>Firma Autorizada de la Carta:</label>
             <input type="text" name="firmante_nombre" id="firmante_nombre" defaultValue={endoso.firmante_nombre || 'Shirley Torres Reyes'} style={{width: '250px', display: 'block', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px'}} />
          </div>
          <div>
             <label htmlFor="firmante_puesto" style={{fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem'}}>Puesto (Ej: Ayudante Especial):</label>
             <input type="text" name="firmante_puesto" id="firmante_puesto" defaultValue={endoso.firmante_puesto || 'Ayudante Especial'} style={{width: '250px', display: 'block', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px'}} />
          </div>
          <button type="submit" className="btn-secondary">Guardar Firma</button>
        </form>
      </div>
    </main>
  );
}
