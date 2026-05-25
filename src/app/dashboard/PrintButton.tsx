'use client';

import { useState, useEffect } from 'react';
import { Printer, X } from 'lucide-react';

export default function PrintButton({ endosoId }: { endosoId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [nombre, setNombre] = useState('Óscar Rodríguez Estrella');
  const [puesto, setPuesto] = useState('Vicealcalde');

  useEffect(() => {
    const savedNombre = localStorage.getItem('firmaNombre');
    const savedPuesto = localStorage.getItem('firmaPuesto');
    if (savedNombre) setNombre(savedNombre);
    if (savedPuesto) setPuesto(savedPuesto);
  }, []);

  const handlePrint = () => {
    localStorage.setItem('firmaNombre', nombre);
    localStorage.setItem('firmaPuesto', puesto);
    
    const url = `/dashboard/endosos/${endosoId}/print?nombre=${encodeURIComponent(nombre)}&puesto=${encodeURIComponent(puesto)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        title="Imprimir Carta Oficial"
        className="p-1.5 bg-gray-100 hover:bg-green-100 hover:text-green-700 rounded-md transition-colors"
      >
        <Printer className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center bg-[#2e5e2e] text-white px-4 py-3">
              <h3 className="font-bold">Opciones de Impresión</h3>
              <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                Por favor, confirme quién firmará esta carta de endoso. El sistema recordará su selección para las próximas cartas.
              </p>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">NOMBRE DEL FIRMANTE</label>
                <input 
                  type="text" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#2e5e2e] focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">PUESTO</label>
                <input 
                  type="text" 
                  value={puesto}
                  onChange={(e) => setPuesto(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#2e5e2e] focus:outline-none"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2 border-t">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button 
                onClick={handlePrint}
                className="px-4 py-2 text-sm font-bold bg-[#2e5e2e] text-white rounded hover:bg-[#1b3d1b] flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Generar Carta
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
