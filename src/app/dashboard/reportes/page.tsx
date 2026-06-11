import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import PrintButton from '@/components/PrintButton';
import ExportExcelButton from '@/components/ExportExcelButton';

export const dynamic = 'force-dynamic';

export default async function ReportesPage(props: {
  searchParams: Promise<{ eventoId?: string; ubicacion?: string; tarima?: string; type?: string }>;
}) {
  const searchParams = await props.searchParams;
  const selectedEventoId = searchParams.eventoId;
  const selectedUbicacion = searchParams.ubicacion;
  const selectedTarima = searchParams.tarima;
  const selectedType = searchParams.type || 'ejecutivo';

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

  const uniqueEndosoTarimas = await prisma.endoso.findMany({
    select: { tarima: true },
  });
  const tarimas = Array.from(
    new Set(uniqueEndosoTarimas.map((e) => e.tarima).filter(Boolean))
  ).sort();

  // Construir consulta filtrada
  const whereClause: any = {};
  if (selectedEventoId) {
    whereClause.eventoId = selectedEventoId;
  }
  if (selectedUbicacion) {
    whereClause.ubicacion = selectedUbicacion;
  }
  if (selectedTarima) {
    whereClause.tarima = selectedTarima;
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
        <div className="flex gap-2">
          <ExportExcelButton data={endosos} />
          <PrintButton />
        </div>
      </div>

      {/* Tabs de Selección de Tipo de Reporte - Ocultos al Imprimir */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-3 print:hidden">
        <Link
          href={`/dashboard/reportes?type=ejecutivo${selectedEventoId ? `&eventoId=${selectedEventoId}` : ''}${selectedUbicacion ? `&ubicacion=${selectedUbicacion}` : ''}${selectedTarima ? `&tarima=${selectedTarima}` : ''}`}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${selectedType === 'ejecutivo' ? 'bg-[#2e5e2e] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Informe Ejecutivo
        </Link>
        <Link
          href={`/dashboard/reportes?type=distribucion${selectedEventoId ? `&eventoId=${selectedEventoId}` : ''}${selectedUbicacion ? `&ubicacion=${selectedUbicacion}` : ''}${selectedTarima ? `&tarima=${selectedTarima}` : ''}`}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${selectedType === 'distribucion' ? 'bg-[#2e5e2e] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Distribución de Kioscos (Compacto)
        </Link>
      </div>

      {/* Tarjeta de Filtros de Búsqueda - Oculta al Imprimir */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 print:hidden">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          🔍 Filtrar Reporte en Tabla
        </h2>
        <form method="GET" className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <input type="hidden" name="type" value={selectedType} />
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

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Por Tarima / Área
            </label>
            <select
              name="tarima"
              defaultValue={selectedTarima || ''}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            >
              <option value="">-- Todas las Tarimas --</option>
              {tarimas.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#2e5e2e] text-white font-medium text-sm rounded-lg hover:bg-[#1b3d1b] transition-all shadow-sm"
            >
              Generar Tabla
            </button>
            {(selectedEventoId || selectedUbicacion || selectedTarima) && (
              <Link
                href={`/dashboard/reportes?type=${selectedType}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-200 transition-all border border-gray-200 text-center"
              >
                Limpiar
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Reporte imprimible en tabla */}
      <div className="bg-white text-black p-8 md:p-12 rounded-xl border border-gray-200 shadow-sm print:border-none print:shadow-none print:p-0">
        <header className="text-center mb-10 border-b-2 border-black pb-4">
          <h1 className="font-bold text-2xl uppercase tracking-tight">
            {selectedType === 'ejecutivo' ? 'Informe Ejecutivo de Endosos' : 'Informe de Distribución de Kioscos'}
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
          {selectedTarima && (
            <p className="font-semibold text-gray-900">
              Tarima / Área: {selectedTarima}
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
            {/* Resumen numérico básico */}
            <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 print:bg-white print:border-none print:p-0 print:mb-4">
              <span className="text-sm font-semibold text-gray-700 uppercase">
                Resumen de Filtro:
              </span>
              <div className="text-sm font-medium">
                Total Registros: <strong className="text-lg font-bold text-[#2e5e2e]">{totales}</strong>
              </div>
            </div>

            {/* Tabla Maestra de Reporte */}
            <div className="overflow-x-auto">
              {selectedType === 'ejecutivo' ? (
                <table id="reporte-tabla" className="w-full border-collapse text-xs text-left">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300 print:bg-gray-100">
                      <th className="p-3 font-semibold text-black">Núm. Control</th>
                      <th className="p-3 font-semibold text-black">Proponente / Negocio</th>
                      <th className="p-3 font-semibold text-black">Evento</th>
                      <th className="p-3 font-semibold text-black">Categoría</th>
                      <th className="p-3 font-semibold text-black">Ubicación</th>
                      <th className="p-3 font-semibold text-black">Tarima</th>
                      <th className="p-3 font-semibold text-black">Estatus</th>
                      <th className="p-3 font-semibold text-black">Inspección</th>
                      <th className="p-3 font-semibold text-black">Fecha Emisión</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endosos.map((e) => {
                      const esPagado = e.status === 'Pagado' || e.status === 'Aprobado';
                      return (
                        <tr key={e.id} className="border-b border-gray-200 hover:bg-gray-50/50">
                          <td className="p-3 font-mono font-medium text-gray-700">{e.controlNumber}</td>
                          <td className="p-3 font-semibold text-gray-900">{e.companyName}</td>
                          <td className="p-3 text-gray-600">{e.evento?.nombre || 'Sin Evento'}</td>
                          <td className="p-3 text-gray-600">{e.categoria?.nombre || 'Sin Categoría'}</td>
                          <td className="p-3 text-gray-600">{e.ubicacion}</td>
                          <td className="p-3 text-gray-600">{e.tarima || '-'}</td>
                          <td className="p-3">
                            <span className={`font-semibold ${esPagado ? 'text-green-800' : 'text-amber-800'}`}>
                              {e.status}
                            </span>
                          </td>
                          <td className="p-3">
                            {e.visitedAt ? (
                              <span className="font-semibold text-green-700 whitespace-nowrap">
                                ✓ {new Date(e.visitedAt).toLocaleDateString('es-PR', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                })}
                              </span>
                            ) : (
                              <span className="text-red-500 font-medium">Pendiente</span>
                            )}
                          </td>
                          <td className="p-3 text-gray-500">
                            {new Date(e.issueDate).toLocaleDateString('es-PR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <table id="reporte-tabla" className="w-full border-collapse text-xs text-left">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300 print:bg-gray-100">
                      <th className="p-3 font-semibold text-black">Representante</th>
                      <th className="p-3 font-semibold text-black">Negocio</th>
                      <th className="p-3 font-semibold text-black">Tarima</th>
                      <th className="p-3 font-semibold text-black">Ubicación</th>
                      <th className="p-3 font-semibold text-black">Evento</th>
                      <th className="p-3 font-semibold text-black">Tipo de Venta</th>
                      <th className="p-3 font-semibold text-black">Fecha del Evento</th>
                      <th className="p-3 font-semibold text-black">Núm. Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endosos.map((e) => (
                      <tr key={e.id} className="border-b border-gray-200 hover:bg-gray-50/50">
                        <td className="p-3 font-semibold text-gray-900">{e.representante || '-'}</td>
                        <td className="p-3 font-semibold text-gray-900">{e.companyName}</td>
                        <td className="p-3 text-gray-600">{e.tarima || '-'}</td>
                        <td className="p-3 text-gray-600">{e.ubicacion}</td>
                        <td className="p-3 text-gray-600">{e.evento?.nombre || 'Sin Evento'}</td>
                        <td className="p-3 text-gray-600">{e.descripcion || '-'}</td>
                        <td className="p-3 text-gray-500">{e.evento?.fechas || '-'}</td>
                        <td className="p-3 font-mono font-medium text-gray-700">{e.controlNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Firmas al pie del reporte impreso */}
            <div className="hidden print:block mt-16 pt-12 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-12 text-center text-xs">
                <div>
                  <div className="border-b border-black w-48 mx-auto mb-2"></div>
                  <p className="font-bold text-gray-900">Preparado Por</p>
                  <p className="text-gray-500">Oficina de Desarrollo Económico</p>
                </div>
                <div>
                  <div className="border-b border-black w-48 mx-auto mb-2"></div>
                  <p className="font-bold text-gray-900">Autorizado Por</p>
                  <p className="text-gray-500">Municipio Autónomo de Toa Baja</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
