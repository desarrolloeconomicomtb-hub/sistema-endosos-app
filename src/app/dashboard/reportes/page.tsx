import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import PrintButton from '@/components/PrintButton';

export const dynamic = 'force-dynamic';

export default async function ReportesPage(props: {
  searchParams: Promise<{ eventoId?: string; ubicacion?: string }>;
}) {
  const searchParams = await props.searchParams;
  const selectedEventoId = searchParams.eventoId;
  const selectedUbicacion = searchParams.ubicacion;

  // Obtener filtros para los selectores
  const eventos = await prisma.evento.findMany({
    orderBy: { nombre: 'asc' },
  });

  const uniqueEndosoUbicaciones = await prisma.endoso.findMany({
    select: { ubicacion: true },
  });
  const ubicaciones = Array.from(
    new Set(uniqueEndosoUbicaciones.map((e) => e.ubicacion).filter(Boolean))
  ).sort();

  // Construir consulta filtrada
  const whereClause: any = {};
  if (selectedEventoId) {
    whereClause.eventoId = selectedEventoId;
  }
  if (selectedUbicacion) {
    whereClause.ubicacion = selectedUbicacion;
  }

  const endosos = await prisma.endoso.findMany({
    where: whereClause,
    include: {
      evento: true,
      categoria: true,
    },
    orderBy: { issueDate: 'desc' },
  });

  const totales = endosos.length;

  // Agrupar por Categorías
  const categoriaCounts: Record<string, number> = {};
  endosos.forEach((e) => {
    const catName = e.categoria?.nombre || 'Sin Categoría';
    categoriaCounts[catName] = (categoriaCounts[catName] || 0) + 1;
  });

  // Agrupar por Estado
  const statusCounts: Record<string, number> = {};
  endosos.forEach((e) => {
    statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
  });

  // Agrupar por Evento
  const eventoCounts: Record<string, number> = {};
  endosos.forEach((e) => {
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

  const currentDate = new Date().toLocaleDateString('es-PR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Nombre del evento/lugar para el título dinámico del reporte
  const activeEventoName = selectedEventoId
    ? eventos.find((ev) => ev.id === selectedEventoId)?.nombre
    : null;

  return (
    <main className="container mx-auto p-4 max-w-5xl">
      {/* Botones de Acción - Ocultos al Imprimir */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Link
          href="/dashboard"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
        >
          &larr; Volver al Dashboard
        </Link>
        <PrintButton />
      </div>

      {/* Tarjeta de Filtros de Búsqueda - Oculta al Imprimir */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 print:hidden">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          🔍 Filtrar Reporte Ejecutivo
        </h2>
        <form method="GET" className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Por Evento
            </label>
            <select
              name="eventoId"
              defaultValue={selectedEventoId || ''}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            >
              <option value="">-- Todos los Eventos --</option>
              {eventos.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Por Lugar / Ubicación
            </label>
            <select
              name="ubicacion"
              defaultValue={selectedUbicacion || ''}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            >
              <option value="">-- Todas las Ubicaciones --</option>
              {ubicaciones.map((ub) => (
                <option key={ub} value={ub}>
                  {ub}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#2e5e2e] text-white font-medium text-sm rounded-lg hover:bg-[#1b3d1b] transition-all shadow-sm"
            >
              Aplicar Filtros
            </button>
            {(selectedEventoId || selectedUbicacion) && (
              <Link
                href="/dashboard/reportes"
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-200 transition-all border border-gray-200 text-center"
              >
                Limpiar
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Reporte imprimible */}
      <div className="bg-white text-black p-8 md:p-12 rounded-xl border border-gray-200 shadow-sm print:border-none print:shadow-none print:p-0">
        <header className="text-center mb-10 border-b-2 border-black pb-4">
          <h1 className="font-bold text-2xl uppercase tracking-tight">
            Informe Ejecutivo de Endosos
          </h1>
          <p className="italic text-lg text-gray-700">
            Municipio Autónomo de Toa Baja
          </p>
          {activeEventoName && (
            <p className="font-semibold text-gray-900 mt-1">
              Evento: {activeEventoName}
            </p>
          )}
          {selectedUbicacion && (
            <p className="font-semibold text-gray-900">
              Lugar / Ubicación: {selectedUbicacion}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">Generado: {currentDate}</p>
        </header>

        {totales === 0 ? (
          <div className="text-center py-12 text-gray-500 font-medium">
            No se encontraron endosos que coincidan con los filtros seleccionados.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Resumen Global */}
              <div className="border border-gray-200 p-6 rounded-xl text-center bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Total Registrados
                </h3>
                <div className="text-4xl font-extrabold text-[#2e5e2e]">{totales}</div>
              </div>

              {/* Estatus */}
              <div className="border border-gray-200 p-6 rounded-xl bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2 mb-3">
                  Estatus
                </h3>
                <ul className="space-y-2 text-sm">
                  {Object.entries(statusCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([k, v]) => (
                      <li key={k} className="flex justify-between items-center">
                        <span>{k}</span>
                        <strong className="text-base font-bold">{v}</strong>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Categorías */}
              <div className="border border-gray-200 p-6 rounded-xl bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2 mb-3">
                  Categorías
                </h3>
                <ul className="space-y-2 text-sm">
                  {Object.entries(categoriaCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([k, v]) => (
                      <li key={k} className="flex justify-between items-center">
                        <span className="truncate max-w-[150px]">{k}</span>
                        <strong className="text-base font-bold">{v}</strong>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Desglose por Evento */}
            <div className="mb-10">
              <h3 className="font-bold border-b-2 border-black pb-2 text-gray-900">
                Resumen por Evento
              </h3>
              <table className="w-full border-collapse mt-4 text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="p-3 text-left font-semibold text-black">
                      Nombre del Evento
                    </th>
                    <th className="p-3 text-center font-semibold text-black w-40">
                      Cantidad de Endosos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(eventoCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([k, v], i) => (
                      <tr key={i} className="border-b border-gray-200">
                        <td className="p-3 text-left">{k}</td>
                        <td className="p-3 text-center font-bold">{v}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Registro Detallado Agrupado por Evento */}
            <div className="page-break-before-auto">
              <h3 className="font-bold border-b-2 border-black pb-2 text-gray-900">
                Registro Detallado de Endosos
              </h3>

              {Object.keys(endososPorEvento)
                .sort()
                .map((evName) => {
                  const lista = endososPorEvento[evName];
                  return (
                    <div key={evName} className="mt-6 mb-8">
                      <h4 className="bg-gray-100 text-black px-4 py-2 rounded font-bold text-sm mb-3">
                        📍 Evento: {evName} ({lista.length} solicitudes)
                      </h4>
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="p-2 text-left font-semibold text-black w-32">
                              Núm. Control
                            </th>
                            <th className="p-2 text-left font-semibold text-black">
                              Solicitante
                            </th>
                            <th className="p-2 text-left font-semibold text-black">
                              Ubicación
                            </th>
                            <th className="p-2 text-left font-semibold text-black w-40">
                              Categoría
                            </th>
                            <th className="p-2 text-left font-semibold text-black w-28">
                              Estatus
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {lista.map((e) => {
                            const esPagado =
                              e.status === 'Pagado' || e.status === 'Aprobado';
                            return (
                              <tr key={e.id} className="border-b border-gray-200">
                                <td className="p-2 font-mono text-gray-600">
                                  {e.controlNumber}
                                </td>
                                <td className="p-2 font-medium">{e.companyName}</td>
                                <td className="p-2">{e.ubicacion}</td>
                                <td className="p-2">
                                  {e.categoria?.nombre || 'Sin Categoría'}
                                </td>
                                <td
                                  className={`p-2 font-semibold ${
                                    esPagado ? 'text-green-800' : 'text-amber-800'
                                  }`}
                                >
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
          </>
        )}
      </div>
    </main>
  );
}
