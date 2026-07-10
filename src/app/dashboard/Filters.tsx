'use client';

import { useRouter, useSearchParams } from "next/navigation";

interface FiltersProps {
  eventos: { id: string; nombre: string }[];
  tarimas: string[];
  ubicaciones: string[];
}

export default function Filters({ eventos, tarimas, ubicaciones }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentEventoId = searchParams.get('eventoId') || '';
  const currentTarima = searchParams.get('tarima') || '';
  const currentUbicacion = searchParams.get('ubicacion') || '';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Evento:</span>
        <select 
          value={currentEventoId}
          onChange={(e) => updateFilters('eventoId', e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white min-w-[180px] focus:outline-none focus:ring-1 focus:ring-green-800"
        >
          <option value="">-- Todos --</option>
          {eventos.map((e) => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tarima:</span>
        <select 
          value={currentTarima}
          onChange={(e) => updateFilters('tarima', e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white min-w-[150px] focus:outline-none focus:ring-1 focus:ring-green-800"
        >
          <option value="">-- Todas --</option>
          {tarimas.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ubicación:</span>
        <select 
          value={currentUbicacion}
          onChange={(e) => updateFilters('ubicacion', e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white min-w-[150px] focus:outline-none focus:ring-1 focus:ring-green-800"
        >
          <option value="">-- Todas --</option>
          {ubicaciones.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
