'use client';

interface BatchPrintHeaderProps {
  count: number;
}

export default function BatchPrintHeader({ count }: BatchPrintHeaderProps) {
  return (
    <div className="no-print bg-gray-50 border-b border-gray-200 py-3 px-4 flex justify-between items-center sticky top-0 z-50">
      <span className="font-bold text-sm text-gray-700">Imprimiendo {count} cartas en lote</span>
      <button 
        onClick={() => window.print()} 
        className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded text-sm transition-colors shadow"
      >
        Imprimir Todo (PDF)
      </button>
    </div>
  );
}
