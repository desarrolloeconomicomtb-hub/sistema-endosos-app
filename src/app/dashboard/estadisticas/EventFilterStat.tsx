'use client';

import { useRouter } from "next/navigation";

export default function EventFilterStat({ eventos, currentEventoId }: { eventos: any[], currentEventoId?: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-white p-3 rounded-lg border border-gray-200 shadow-sm w-fit">
      <span className="text-sm font-bold text-gray-700 whitespace-nowrap">Ver detalles por Evento/Tarima:</span>
      <select 
        value={currentEventoId || ''}
        onChange={(e) => {
          if (e.target.value) {
            router.push(`/dashboard/estadisticas?eventoId=${e.target.value}`);
          } else {
            router.push(`/dashboard/estadisticas`);
          }
        }}
        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-gray-50 focus:ring-black focus:border-black cursor-pointer"
      >
        <option value="">Vista General (Todos)</option>
        {eventos.map((e) => (
          <option key={e.id} value={e.id}>{e.nombre}</option>
        ))}
      </select>
    </div>
  );
}
