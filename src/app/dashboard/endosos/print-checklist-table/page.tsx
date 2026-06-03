import { prisma } from "@/lib/prisma";
import PrintAction from "../[id]/print/PrintAction";

export default async function PrintChecklistTablePage(props: { searchParams: Promise<{ eventoId?: string }> }) {
  const searchParams = await props.searchParams;
  const eventoId = searchParams.eventoId;

  if (!eventoId) {
    return <div className="p-10 text-center font-bold text-xl">Debe seleccionar (filtrar) un evento en el panel principal primero para poder generar la tabla de checklist de los inspectores.</div>;
  }

  const evento = await prisma.evento.findUnique({ where: { id: eventoId } });
  
  const endosos = await prisma.endoso.findMany({
    where: { eventoId },
    include: { categoria: true },
    orderBy: [
      { tarima: 'asc' },
      { companyName: 'asc' }
    ]
  });

  return (
    <div className="bg-white min-h-screen text-black p-8 mx-auto print:p-0 print:m-0">
      <PrintAction />
      {/* Force Landscape for printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @page { size: landscape; margin: 0.4in; }
      `}} />

      <div className="mb-4 flex justify-between items-end border-b-4 border-black pb-4">
        <div className="flex items-center gap-4">
          <img src="/images/escudo-toa-baja.png" alt="Escudo" className="h-16" />
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Tabla de Fiscalización Avanzada (Checklist)</h1>
            <h2 className="text-xl font-bold text-gray-700 uppercase">{evento?.nombre} &bull; Inspección en Calle</h2>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl">Negocios: {endosos.length}</p>
          <p className="text-sm text-gray-500">Fecha: {new Date().toLocaleDateString('es-PR')}</p>
        </div>
      </div>

      <table className="w-full text-xs border-2 border-black border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-black text-gray-800">
            <th className="py-2 px-1 text-left border border-gray-400">Tarima</th>
            <th className="py-2 px-1 text-left border border-gray-400">Negocio</th>
            <th className="py-2 px-1 text-left border border-gray-400">Categoría</th>
            <th className="py-2 px-1 text-center w-16 border border-gray-400 bg-red-50 text-red-900">Estatus Pago</th>
            <th className="py-2 px-1 text-center w-12 border border-gray-400">Patente</th>
            <th className="py-2 px-1 text-center w-12 border border-gray-400">Permiso Kiosco</th>
            <th className="py-2 px-1 text-center w-12 border border-gray-400">Basura ($75)</th>
            <th className="py-2 px-1 text-center w-12 border border-gray-400">Salud</th>
            <th className="py-2 px-1 text-center w-12 border border-gray-400">Bomberos</th>
            <th className="py-2 px-1 text-center w-12 border border-gray-400">Bebidas Alcoh.</th>
            <th className="py-2 px-1 text-center w-12 border border-gray-400">Extintor ABC</th>
            <th className="py-2 px-1 text-center w-12 border border-gray-400 bg-green-50 text-green-900 font-bold">QR / Visita</th>
            <th className="py-2 px-1 text-left w-32 border border-gray-400">Notas / Deficiencias</th>
          </tr>
        </thead>
        <tbody>
          {endosos.map((endoso, i) => {
            const isPaid = endoso.reciboPatente || endoso.reciboAmbulante || endoso.reciboBebidas;
            const isExempt = endoso.exentoPago;
            const enCumplimiento = isPaid || isExempt;
            const statusLabel = enCumplimiento ? 'OK' : 'DEBE';
            
            return (
              <tr key={endoso.id} className={`border-b border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="py-2 px-1 border border-gray-300 font-bold uppercase whitespace-nowrap">{endoso.tarima || '—'}</td>
                <td className="py-2 px-1 border border-gray-300 font-bold text-gray-900 uppercase">
                  <div>{endoso.companyName}</div>
                  <div className="text-[9px] font-mono text-gray-500 font-normal">{endoso.controlNumber}</div>
                </td>
                <td className="py-2 px-1 border border-gray-300 text-gray-600">{endoso.categoria?.nombre || 'Sin Categoría'}</td>
                <td className={`py-2 px-1 border border-gray-300 text-center font-black ${enCumplimiento ? 'text-green-600 bg-green-50/20' : 'text-red-600 bg-red-50/20'}`}>
                  {statusLabel}
                </td>
                
                {/* Checkbox columns for inspector checklist */}
                <td className="py-2 px-1 border border-gray-300 text-center">
                  <div className="w-4 h-4 mx-auto border border-black rounded-sm bg-white flex items-center justify-center font-bold text-[10px]">
                    {endoso.reciboPatente ? '✓' : ''}
                  </div>
                </td>
                <td className="py-2 px-1 border border-gray-300 text-center">
                  <div className="w-4 h-4 mx-auto border border-black rounded-sm bg-white flex items-center justify-center font-bold text-[10px]">
                    {endoso.reciboAmbulante ? '✓' : ''}
                  </div>
                </td>
                <td className="py-2 px-1 border border-gray-300 text-center">
                  <div className="w-4 h-4 mx-auto border border-black rounded-sm bg-white flex items-center justify-center font-bold text-[10px]">
                    {isPaid ? '✓' : ''}
                  </div>
                </td>
                <td className="py-2 px-1 border border-gray-300 text-center">
                  <div className="w-4 h-4 mx-auto border border-black rounded-sm bg-white"></div>
                </td>
                <td className="py-2 px-1 border border-gray-300 text-center">
                  <div className="w-4 h-4 mx-auto border border-black rounded-sm bg-white"></div>
                </td>
                <td className="py-2 px-1 border border-gray-300 text-center">
                  <div className="w-4 h-4 mx-auto border border-black rounded-sm bg-white flex items-center justify-center font-bold text-[10px]">
                    {endoso.reciboBebidas ? '✓' : ''}
                  </div>
                </td>
                <td className="py-2 px-1 border border-gray-300 text-center">
                  <div className="w-4 h-4 mx-auto border border-black rounded-sm bg-white"></div>
                </td>
                <td className="py-2 px-1 border border-gray-300 text-center bg-green-50/10">
                  <div className="w-4 h-4 mx-auto border border-green-700 rounded-sm bg-white flex items-center justify-center font-bold text-green-700 text-[10px]">
                    {endoso.visitedAt ? '✓' : ''}
                  </div>
                </td>
                <td className="py-2 px-1 border border-gray-300 text-gray-400"></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Footer page notes */}
      <div className="mt-8 text-[9px] text-gray-500 border-t border-gray-200 pt-4 flex justify-between">
        <p>* Los encasillados con gancho (✓) corresponden a requisitos validados automáticamente en la base de datos municipal.</p>
        <p>Fiscalización de Endosos Temporales - Municipio Autónomo de Toa Baja</p>
      </div>
    </div>
  );
}
