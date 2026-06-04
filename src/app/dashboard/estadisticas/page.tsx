import { prisma } from "@/lib/prisma";
import ChartsClient from "./ChartsClient";
import TarimaChartsClient from "./TarimaChartsClient";
import EventFilterStat from "./EventFilterStat";
import { FileText, Calendar, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EstadisticasPage(props: { searchParams: Promise<{ eventoId?: string }> }) {
  const searchParams = await props.searchParams;
  const eventoId = searchParams.eventoId;

  // Queries
  const totalEndosos = await prisma.endoso.count();
  const totalEventos = await prisma.evento.count();
  const totalCategorias = await prisma.categoria.count();

  const eventos = await prisma.evento.findMany({ orderBy: { createdAt: 'desc' } });

  // Data for Category Pie Chart (General)
  const endososPorCategoriaRaw = await prisma.categoria.findMany({
    include: { _count: { select: { endosos: true } } }
  });
  const dataCategoria = endososPorCategoriaRaw
    .map(c => ({ name: c.nombre, value: c._count.endosos }))
    .filter(c => c.value > 0);

  // Data for Event Bar Chart (General)
  const endososPorEventoRaw = await prisma.evento.findMany({
    include: { _count: { select: { endosos: true } } }
  });
  const dataEvento = endososPorEventoRaw
    .map(e => ({ name: e.nombre, value: e._count.endosos }))
    .filter(e => e.value > 0);

  // Data for Pagos Chart (General)
  const allEndosos = await prisma.endoso.findMany({
    select: {
      reciboPatente: true,
      reciboAmbulante: true,
      reciboBebidas: true,
      exentoPago: true,
      evento: { select: { nombre: true } }
    }
  });

  const pagosPorEventoMap = new Map();
  allEndosos.forEach(e => {
    const eventoNombre = e.evento?.nombre || 'Evento No Asignado';
    if (!pagosPorEventoMap.has(eventoNombre)) {
      pagosPorEventoMap.set(eventoNombre, { name: eventoNombre, Pagados: 0, Pendientes: 0, Exentos: 0 });
    }
    
    if (e.exentoPago) {
      pagosPorEventoMap.get(eventoNombre).Exentos++;
    } else {
      const isPaid = e.reciboPatente || e.reciboAmbulante || e.reciboBebidas;
      if (isPaid) {
        pagosPorEventoMap.get(eventoNombre).Pagados++;
      } else {
        pagosPorEventoMap.get(eventoNombre).Pendientes++;
      }
    }
  });
  const dataPagos = Array.from(pagosPorEventoMap.values());

  // Data for Tarima (If filtered by Event)
  let dataTarima: any[] = [];
  let dataPagosTarima: any[] = [];
  
  if (eventoId) {
    const endososEvento = await prisma.endoso.findMany({
      where: { eventoId },
      select: { tarima: true, reciboPatente: true, reciboAmbulante: true, reciboBebidas: true, exentoPago: true }
    });

    const tarimaCount = new Map();
    const tarimaPagos = new Map();

    endososEvento.forEach(e => {
      const t = e.tarima || 'Sin Tarima';
      // Negocios por tarima
      tarimaCount.set(t, (tarimaCount.get(t) || 0) + 1);
      
      // Pagos por tarima
      if (!tarimaPagos.has(t)) {
        tarimaPagos.set(t, { name: t, Pagados: 0, Exentos: 0, Pendientes: 0 });
      }
      if (e.exentoPago) {
        tarimaPagos.get(t).Exentos++;
      } else {
        const isPaid = e.reciboPatente || e.reciboAmbulante || e.reciboBebidas;
        if (isPaid) {
          tarimaPagos.get(t).Pagados++;
        } else {
          tarimaPagos.get(t).Pendientes++;
        }
      }
    });

    dataTarima = Array.from(tarimaCount.entries()).map(([name, value]) => ({ name, value }));
    dataPagosTarima = Array.from(tarimaPagos.values());
  }

  // Report by Event, Tarima, Category, and Payment status
  const reportDataQuery = await prisma.endoso.findMany({
    select: {
      tarima: true,
      reciboPatente: true,
      reciboAmbulante: true,
      reciboBebidas: true,
      exentoPago: true,
      evento: { select: { id: true, nombre: true } },
      categoria: { select: { nombre: true } }
    }
  });

  const reportMap = new Map<string, {
    eventoId: string;
    eventoNombre: string;
    tarima: string;
    categoriaNombre: string;
    pagados: number;
    pendientes: number;
    exentos: number;
    total: number;
  }>();

  reportDataQuery.forEach(e => {
    const evId = e.evento?.id || 'none';
    const evNombre = e.evento?.nombre || 'Evento No Asignado';
    const t = e.tarima || 'Sin Tarima';
    const catNombre = e.categoria?.nombre || 'Sin Actividad';
    const key = `${evId}-${t}-${catNombre}`;

    if (!reportMap.has(key)) {
      reportMap.set(key, {
        eventoId: evId,
        eventoNombre: evNombre,
        tarima: t,
        categoriaNombre: catNombre,
        pagados: 0,
        pendientes: 0,
        exentos: 0,
        total: 0
      });
    }

    const entry = reportMap.get(key)!;
    entry.total++;

    if (e.exentoPago) {
      entry.exentos++;
    } else {
      const isPaid = e.reciboPatente || e.reciboAmbulante || e.reciboBebidas;
      if (isPaid) {
        entry.pagados++;
      } else {
        entry.pendientes++;
      }
    }
  });

  let reportList = Array.from(reportMap.values());
  if (eventoId) {
    reportList = reportList.filter(item => item.eventoId === eventoId);
  }

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Estadísticas</h1>
          <p className="text-gray-500 mt-2">Métricas y rendimiento de los endosos otorgados.</p>
        </div>
        <EventFilterStat eventos={eventos} currentEventoId={eventoId} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Endosos</p>
            <p className="text-3xl font-bold text-gray-900">{totalEndosos}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Eventos Activos</p>
            <p className="text-3xl font-bold text-gray-900">{totalEventos}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Categorías</p>
            <p className="text-3xl font-bold text-gray-900">{totalCategorias}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      {eventoId ? (
        <TarimaChartsClient dataTarima={dataTarima} dataPagosTarima={dataPagosTarima} />
      ) : (
        totalEndosos > 0 ? (
          <ChartsClient dataCategoria={dataCategoria} dataEvento={dataEvento} dataPagos={dataPagos} />
        ) : (
          <div className="mt-12 text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p>No hay suficientes datos para mostrar gráficas todavía.</p>
          </div>
        )
      )}

      {/* Detailed Payment Report Table */}
      <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Reporte Detallado de Estatus de Pagos por Evento, Tarima y Actividad</h2>
          <p className="text-sm text-gray-500 mt-1">
            Resumen consolidado de endosos, pagos registrados y exenciones agrupados por tarima y tipo de actividad.
          </p>
        </div>

        {reportList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/75 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Evento</th>
                  <th className="px-6 py-4">Tarima</th>
                  <th className="px-6 py-4">Actividad</th>
                  <th className="px-6 py-4 text-center">Pagados</th>
                  <th className="px-6 py-4 text-center">Exentos</th>
                  <th className="px-6 py-4 text-center">Pendientes</th>
                  <th className="px-6 py-4 text-center font-bold">Total</th>
                  <th className="px-6 py-4">Progreso de Recaudación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {reportList.map((item, idx) => {
                  const paidRatio = item.total > 0 ? ((item.pagados + item.exentos) / item.total) * 100 : 0;
                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.eventoNombre}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                          {item.tarima}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {item.categoriaNombre}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                          {item.pagados}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">
                          {item.exentos}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700">
                          {item.pendientes}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-900">{item.total}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                paidRatio === 100 ? 'bg-emerald-500' : paidRatio > 50 ? 'bg-blue-500' : 'bg-yellow-500'
                              }`} 
                              style={{ width: `${paidRatio}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                            {paidRatio.toFixed(0)}% cumplido
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No se encontraron registros de endosos para este evento.
          </div>
        )}
      </div>
    </div>
  );
}
