'use client';

import { useRouter } from "next/navigation";

export default function EventFilter({ eventos, currentEventoId }: { eventos: any[], currentEventoId?: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-gray-700">Filtrar por Evento:</span>
      <select 
        value={currentEventoId || ''}
        onChange={(e) => {
          if (e.target.value) {
            router.push(`/dashboard?eventoId=${e.target.value}`);
          } else {
            router.push(`/dashboard`);
          }
        }}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white min-w-[200px]"
      >
        <option value="">-- Todos los Eventos --</option>
        {eventos.map((e) => (
          <option key={e.id} value={e.id}>{e.nombre}</option>
        ))}
      </select>
    </div>
  );
}
