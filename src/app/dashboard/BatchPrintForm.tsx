'use client';

import { useState } from 'react';
import { Printer } from 'lucide-react';

export default function BatchPrintForm({ children }: { children: React.ReactNode }) {
  const [selectedCount, setSelectedCount] = useState(0);

  const updateCount = () => {
    const checked = document.querySelectorAll('input[name="ids"]:checked');
    setSelectedCount(checked.length);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxes = document.querySelectorAll('input[name="ids"]');
    checkboxes.forEach((cb: any) => {
      cb.checked = e.target.checked;
    });
    updateCount();
  };

  return (
    <form method="GET" action="/dashboard/batch-carta" target="_blank" onChange={updateCount}>
      <div className="p-3 flex items-center gap-4 border-b border-gray-200 bg-gray-50/50 print:hidden">
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer bg-white px-3 py-1.5 border border-gray-200 rounded shadow-sm hover:bg-gray-50 transition-colors">
          <input 
            type="checkbox" 
            id="select-all" 
            onChange={handleSelectAll}
            className="rounded text-[#2e5e2e] focus:ring-[#2e5e2e] cursor-pointer w-4 h-4"
          />
          Seleccionar Todos
        </label>
        
        {selectedCount > 0 && (
          <div className="flex gap-2">
            <button 
              type="submit" 
              formAction="/dashboard/batch-carta"
              className="flex items-center gap-1.5 bg-[#2e5e2e] text-white px-3 py-1.5 rounded hover:bg-[#1b3d1b] transition-all font-bold text-xs shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Generar {selectedCount} Cartas en Lote
            </button>
            <button 
              type="submit" 
              formAction="/dashboard/endosos/print-marbetes"
              className="flex items-center gap-1.5 bg-blue-700 text-white px-3 py-1.5 rounded hover:bg-blue-800 transition-all font-bold text-xs shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Generar {selectedCount} Marbetes en Lote
            </button>
          </div>
        )}
      </div>
      {children}
    </form>
  );
}
