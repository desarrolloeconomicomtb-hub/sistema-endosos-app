import { prisma } from "@/lib/prisma";
import PrintAction from "../[id]/print/PrintAction";

export default async function PrintListPage(props: { searchParams: Promise<{ eventoId?: string }> }) {
  const searchParams = await props.searchParams;
  const eventoId = searchParams.eventoId;

  if (!eventoId) {
    return <div className="p-10 text-center font-bold text-xl">Debe seleccionar (filtrar) un evento en el panel principal primero para poder generar su lista de cotejo.</div>;
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
        @page { size: landscape; margin: 0.5in; }
      `}} />

      <div className="mb-4 flex justify-between items-end border-b-4 border-black pb-4">
        <div className="flex items-center gap-4">
          <img src="/images/escudo-toa-baja.png" alt="Escudo" className="h-16" />
          <div>
            <h1 className="text-3xl font-black uppercase">Lista Oficial de Fiscalización</h1>
            <h2 className="text-xl font-bold text-gray-700 uppercase">{evento?.nombre}</h2>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl">Total: {endosos.length}</p>
          <p className="text-sm text-gray-500">Generado el: {new Date().toLocaleDateString('es-PR')}</p>
        </div>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-200 border-y-2 border-black text-gray-800">
            <th className="py-2 px-2 text-left w-20">Estatus</th>
            <th className="py-2 px-2 text-left">Tarima</th>
            <th className="py-2 px-2 text-left">Control</th>
            <th className="py-2 px-2 text-left">Negocio</th>
            <th className="py-2 px-2 text-left">Categoría</th>
            <th className="py-2 px-2 text-left">Teléfono</th>
            <th className="py-2 px-2 text-center w-24">Inspección</th>
            <th className="py-2 px-2 text-left w-32">Notas</th>
          </tr>
        </thead>
        <tbody>
          {endosos.map((endoso, i) => {
            const isPaid = endoso.reciboPatente || endoso.reciboAmbulante || endoso.reciboBebidas;
            const isExempt = endoso.exentoPago;
            const enCumplimiento = isPaid || isExempt;
            const status = isExempt ? 'EXENTO' : (isPaid ? 'OK' : 'DEBE');
            
            return (
              <tr key={endoso.id} className={`border-b border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className={`py-3 px-2 font-black ${
                  isExempt ? 'text-blue-600' : (isPaid ? 'text-green-600' : 'text-red-600')
                }`}>{status}</td>
                <td className="py-3 px-2 font-bold uppercase">{endoso.tarima || '—'}</td>
                <td className="py-3 px-2 font-mono text-[10px] text-gray-500">{endoso.controlNumber}</td>
                <td className="py-3 px-2 font-bold text-gray-900 uppercase">{endoso.companyName}</td>
                <td className="py-3 px-2 text-xs">{endoso.categoria?.nombre || 'Sin Categoría'}</td>
                <td className="py-3 px-2 text-xs font-mono">{endoso.telefono || '—'}</td>
                <td className="py-3 px-2">
                  <div className="flex justify-center items-center">
                    <div className="w-6 h-6 border-2 border-black rounded-sm bg-white flex items-center justify-center font-bold text-green-700 text-xs">
                      {endoso.visitedAt ? "✓" : ""}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2"></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
