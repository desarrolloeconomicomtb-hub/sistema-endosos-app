'use client';
import { BadgeCheck } from "lucide-react";

export default function MarbeteButton({ endosoId, isPaid, isExempt, status }: { endosoId: string, isPaid: boolean, isExempt: boolean, status: string }) {
  const enCumplimiento = !!(isPaid || isExempt) && status !== 'Cancelado';

  if (status === 'Cancelado') {
    return (
      <button 
        disabled 
        className="text-gray-300 cursor-not-allowed hover:text-red-400 transition-colors" 
        title="Negocio Cancelado: No se puede generar marbete"
      >
        <BadgeCheck className="w-5 h-5" />
      </button>
    );
  }

  if (!enCumplimiento) {
    return (
      <button 
        disabled 
        className="text-gray-300 cursor-not-allowed hover:text-red-400 transition-colors" 
        title="Pago Pendiente: No se puede generar marbete"
      >
        <BadgeCheck className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button 
      onClick={() => window.open(`/dashboard/endosos/${endosoId}/marbete`, '_blank')} 
      className="text-gray-400 hover:text-[#2e5e2e] transition-colors" 
      title="Imprimir Marbete de Cumplimiento"
    >
      <BadgeCheck className="w-5 h-5" />
    </button>
  );
}
