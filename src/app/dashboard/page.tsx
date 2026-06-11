import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Printer, Edit2, FileText, Search, Plus, BadgeCheck, ClipboardList } from "lucide-react";
import PrintButton from "./PrintButton";
import MarbeteButton from "./MarbeteButton";
import EventFilter from "./EventFilter";
import DeleteEndosoButton from "./DeleteEndosoButton";

export const dynamic = 'force-dynamic';

export default async function DashboardPage(props: { searchParams: Promise<{ eventoId?: string }> }) {
  const searchParams = await props.searchParams;
  const eventoId = searchParams.eventoId;

  const eventos = await prisma.evento.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const endosos = await prisma.endoso.findMany({
    where: eventoId ? { eventoId } : undefined,
    include: {
      evento: true,
      categoria: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-gray-800">Registro de Endosos</h1>
            <EventFilter eventos={eventos} currentEventoId={eventoId} />
          </div>
          <div className="flex gap-3">
            <Link 
              href={`/dashboard/endosos/print-list${eventoId ? `?eventoId=${eventoId}` : ''}`} 
              target="_blank" 
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm border border-blue-200 shadow-sm"
              title="Imprimir lista de cotejo para fiscalización"
            >
              <ClipboardList className="w-4 h-4" /> Imprimir Lista
            </Link>
            <Link 
              href={`/dashboard/endosos/print-checklist-table${eventoId ? `?eventoId=${eventoId}` : ''}`} 
              target="_blank" 
              className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm border border-purple-200 shadow-sm"
              title="Imprimir tabla de checklist avanzada para inspectores"
            >
              <ClipboardList className="w-4 h-4" /> Checklist en Tabla
            </Link>
            <Link 
              href={`/dashboard/endosos/print-all${eventoId ? `?eventoId=${eventoId}` : ''}`} 
              target="_blank" 
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm border border-gray-200 shadow-sm"
            >
              <Printer className="w-4 h-4" /> Imprimir Cartas
            </Link>
            <Link 
              href={`/dashboard/endosos/print-marbetes${eventoId ? `?eventoId=${eventoId}` : ''}`} 
              target="_blank" 
              className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm border border-green-200 shadow-sm"
              title="Imprimir todos los marbetes válidos"
            >
              <BadgeCheck className="w-4 h-4" /> Imprimir Marbetes
            </Link>
            <Link 
              href="/dashboard/endosos/nuevo" 
              className="flex items-center gap-2 bg-[#2e5e2e] text-white px-4 py-2 rounded-lg hover:bg-[#1b3d1b] transition-colors font-medium text-sm shadow-md"
            >
              <Plus className="w-4 h-4" /> Nuevo Endoso
            </Link>
          </div>
        </div>

      <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
        <div className="p-3 flex items-center justify-between border-b border-gray-200 bg-gray-50/50">
          <div className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all bg-white"
            />
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {endosos.length} Registros
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 font-medium text-gray-500 w-32">Control #</th>
                <th className="px-5 py-3 font-medium text-gray-500">Proponente</th>
                <th className="px-5 py-3 font-medium text-gray-500">Evento</th>
                <th className="px-5 py-3 font-medium text-gray-500 w-48">Categoría</th>
                <th className="px-5 py-3 font-medium text-gray-500 w-32">Emisión</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-right w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {endosos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FileText className="w-8 h-8 mb-4 stroke-[1.5]" />
                      <p className="text-sm font-medium text-gray-900">Sin datos</p>
                      <p className="text-sm mt-1 mb-4">No hay endosos registrados aún.</p>
                      <Link href="/dashboard/endosos/nuevo" className="text-sm text-black underline underline-offset-4 font-medium hover:text-gray-600">
                        Crear el primero
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                endosos.map((endoso) => (
                  <tr key={endoso.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-600">
                      {endoso.controlNumber}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-900">
                      {endoso.companyName}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {endoso.evento?.nombre || 'Evento No Asignado'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {endoso.categoria?.nombre || 'Sin Categoría'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {new Date(endoso.issueDate).toLocaleDateString('es-PR', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <MarbeteButton 
                          endosoId={endoso.id} 
                          isPaid={!!(endoso.reciboPatente || endoso.reciboAmbulante || endoso.reciboBebidas)} 
                          isExempt={endoso.exentoPago} 
                        />
                        <PrintButton endosoId={endoso.id} />
                        <Link 
                          href={`/dashboard/endoso/${endoso.id}/checklist`} 
                          target="_blank"
                          className="p-1.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-md transition-colors" 
                          title="Ver Hoja de Requisitos / Checklist"
                        >
                          <ClipboardList className="w-4 h-4" />
                        </Link>
                        <Link href={`/dashboard/endosos/${endoso.id}/editar`} className="text-gray-400 hover:text-black transition-colors" title="Editar">
                          <Edit2 className="w-5 h-5" />
                        </Link>
                        <DeleteEndosoButton id={endoso.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
