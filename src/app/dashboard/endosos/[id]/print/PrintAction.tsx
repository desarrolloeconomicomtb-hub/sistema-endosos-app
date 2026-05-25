'use client';

export default function PrintAction() {
  return (
    <div className="print:hidden fixed top-4 right-4 bg-gray-100 p-4 rounded-lg shadow-lg flex flex-col gap-2 max-w-sm border border-gray-200">
      <h3 className="font-bold text-gray-800 text-sm">Vista de Impresión</h3>
      <p className="text-xs text-gray-600 mb-2">Configure su impresora para usar tamaño Carta (Letter), márgenes predeterminados y habilitar gráficos de fondo si es necesario.</p>
      <button 
        onClick={() => window.print()}
        className="bg-[#2e5e2e] hover:bg-[#1b3d1b] text-white px-4 py-2 rounded-md font-bold text-sm"
      >
        Imprimir Carta
      </button>
    </div>
  );
}
