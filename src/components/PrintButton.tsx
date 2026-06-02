'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <div className="flex flex-col items-end gap-1">
      <button 
        onClick={() => window.print()} 
        className="flex items-center gap-2 bg-[#2e5e2e] text-white px-5 py-2.5 rounded-lg hover:bg-[#1b3d1b] transition-all font-bold text-sm shadow-md"
      >
        <Printer className="w-4 h-4" /> 📥 Descargar / Imprimir PDF
      </button>
      <span className="text-[10px] text-gray-500 font-medium print:hidden">
        (Selecciona &quot;Guardar como PDF&quot; en el destino de impresión)
      </span>
    </div>
  );
}
