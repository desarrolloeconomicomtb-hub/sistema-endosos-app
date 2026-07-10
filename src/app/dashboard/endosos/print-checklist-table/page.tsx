import { prisma } from "@/lib/prisma";
import PrintAction from "../[id]/print/PrintAction";

export default async function PrintChecklistTablePage(props: { 
  searchParams: Promise<{ eventoId?: string; tarima?: string; ubicacion?: string }> 
}) {
  const searchParams = await props.searchParams;
  const { eventoId, tarima, ubicacion } = searchParams;

  if (!eventoId) {
    return <div className="p-10 text-center font-bold text-xl">Debe seleccionar (filtrar) un evento en el panel principal primero para poder generar la tabla de checklist de los inspectores.</div>;
  }

  const evento = await prisma.evento.findUnique({ where: { id: eventoId } });
  
  const endosos = await prisma.endoso.findMany({
    where: {
      eventoId,
      ...(tarima ? { tarima } : {}),
      ...(ubicacion ? { ubicacion } : {}),
    },
    include: { categoria: true },
    orderBy: [
      { tarima: 'asc' },
      { companyName: 'asc' }
    ]
  });

  // Group endosos by tarima
  const groupedByTarima: Record<string, typeof endosos> = {};
  endosos.forEach((endoso) => {
    const t = endoso.tarima || "Sin Tarima Asignada";
    if (!groupedByTarima[t]) {
      groupedByTarima[t] = [];
    }
    groupedByTarima[t].push(endoso);
  });

  return (
    <div className="bg-white min-h-screen text-black p-8 mx-auto print:p-0 print:m-0">
      <PrintAction />
      {/* Force Landscape for printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @page { size: landscape; margin: 0.4in; }
      `}} />

      <div className="mb-6 flex justify-between items-end border-b-4 border-black pb-4">
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

      {Object.entries(groupedByTarima).map(([tarimaName, items], idx) => (
        <div key={tarimaName} className={`${idx > 0 ? 'print:page-break-before mt-8' : ''}`}>
          <div className="bg-gray-100 px-3 py-2 border-2 border-black border-b-0 font-bold text-sm text-black flex justify-between items-center">
            <span className="uppercase font-extrabold text-green-900">Ubicación / Tarima: {tarimaName}</span>
            <span className="text-xs font-semibold text-gray-700">Total: {items.length} negocios</span>
          </div>
          <table className="w-full text-xs border-2 border-black border-collapse mb-8">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-black text-gray-800">
                <th className="py-2 px-1 text-left border border-gray-400">Negocio</th>
                <th className="py-2 px-1 text-left border border-gray-400">Categoría</th>
                <th className="py-2 px-1 text-center w-16 border border-gray-400 bg-red-50 text-red-900">Estatus Pago</th>
                <th className="py-2 px-1 text-center w-12 border border-gray-400">Patente</th>
                <th className="py-2 px-1 text-center w-12 border border-gray-400">Permiso Kiosco</th>
                <th className="py-2 px-1 text-center w-12 border border-gray-400">Basura ($75)</th>
                <th className="py-2 px-1 text-center w-12 border border-gray-400">Bebidas Alcoh.</th>
                <th className="py-2 px-1 text-left w-32 border border-gray-400">Recibos</th>
                <th className="py-2 px-1 text-center w-12 border border-gray-400 bg-green-50 text-green-900 font-bold">QR / Visita</th>
                <th className="py-2 px-1 text-left w-32 border border-gray-400">Notas / Deficiencias</th>
              </tr>
            </thead>
            <tbody>
              {items.map((endoso, i) => {
                const isPaid = endoso.reciboPatente || endoso.reciboAmbulante || endoso.reciboBebidas;
                const isExempt = endoso.exentoPago;
                const enCumplimiento = isPaid || isExempt;
                const statusLabel = isExempt ? 'EXENTO' : (isPaid ? 'OK' : 'DEBE');

                const rawRecibos = [endoso.reciboPatente, endoso.reciboAmbulante, endoso.reciboBebidas]
                  .filter(Boolean) as string[];
                const cleanRecibosList = rawRecibos
                  .flatMap(r => r.split(/[\/\s,]+/))
                  .map(num => num.trim())
                  .filter(Boolean);
                const recibosSeparados = cleanRecibosList.join(' ');
                
                return (
                  <tr key={endoso.id} className={`border-b border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="py-2 px-1 border border-gray-300 font-bold text-gray-900 uppercase">
                      <div>{endoso.companyName}</div>
                      <div className="text-[9px] font-mono text-gray-500 font-normal">{endoso.controlNumber}</div>
                    </td>
                    <td className="py-2 px-1 border border-gray-300 text-gray-600">{endoso.categoria?.nombre || 'Sin Categoría'}</td>
                    <td className={`py-2 px-1 border border-gray-300 text-center font-black ${
                      isExempt 
                        ? 'text-blue-600 bg-blue-50/20' 
                        : (isPaid ? 'text-green-600 bg-green-50/20' : 'text-red-600 bg-red-50/20')
                    }`}>
                      {statusLabel}
                    </td>
                    
                    {/* Checkbox columns for inspector checklist */}
                    <td className="py-2 px-1 border border-gray-300 text-center">
                      <div className="w-4 h-4 mx-auto border border-black rounded-sm bg-white"></div>
                    </td>
                    <td className="py-2 px-1 border border-gray-300 text-center">
                      <div className="w-4 h-4 mx-auto border border-black rounded-sm bg-white"></div>
                    </td>
                    <td className="py-2 px-1 border border-gray-300 text-center">
                      <div className="w-4 h-4 mx-auto border border-black rounded-sm bg-white"></div>
                    </td>
                    <td className="py-2 px-1 border border-gray-300 text-center">
                      <div className="w-4 h-4 mx-auto border border-black rounded-sm bg-white"></div>
                    </td>
                    <td className="py-2 px-1 border border-gray-300 font-mono text-[10px] whitespace-normal break-all">
                      {recibosSeparados || '—'}
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
        </div>
      ))}

      {/* Footer page notes */}
      <div className="mt-8 text-[9px] text-gray-500 border-t border-gray-200 pt-4 flex justify-between">
        <p>Fiscalización de Endosos Temporales - Municipio Autónomo de Toa Baja</p>
      </div>
    </div>
  );
}
