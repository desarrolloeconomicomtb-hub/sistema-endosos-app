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
    .map(c => ({ name: c.companyName, value: c._count.endosos }))
    .filter(c => c.value > 0);

  // Data for Event Bar Chart (General)
  const endososPorEventoRaw = await prisma.evento.findMany({
    include: { _count: { select: { endosos: true } } }
  });
  const dataEvento = endososPorEventoRaw
    .map(e => ({ name: e.companyName, value: e._count.endosos }))
    .filter(e => e.value > 0);

  // Data for Pagos Chart (General)
  const allEndosos = await prisma.endoso.findMany({
    select: {
      reciboPatente: true,
      reciboAmbulante: true,
      reciboBebidas: true,
      exentoPago: true,
      evento: { select: { companyName: true } }
    }
  });

  const pagosPorEventoMap = new Map();
  allEndosos.forEach(e => {
    const eventoNombre = e.evento.companyName;
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
    </div>
  );
}
