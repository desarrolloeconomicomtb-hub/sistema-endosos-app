'use client';

import * as XLSX from 'xlsx';
import { FileDown } from 'lucide-react';

interface ExportExcelButtonProps {
  data: any[]; // Keep props signature for compatibility, although we export from DOM
}

export default function ExportExcelButton({ data }: ExportExcelButtonProps) {
  const handleExport = () => {
    const table = document.getElementById('reporte-tabla');
    if (!table) {
      alert('No se encontró la tabla de reporte para exportar.');
      return;
    }

    // Generate workbook directly from the HTML table
    const workbook = XLSX.utils.table_to_book(table, { raw: true });
    
    // Auto-fit column widths
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    if (worksheet && worksheet['!ref']) {
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      const cols = [];
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let maxLen = 10; // Default min width
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
          if (cell && cell.v) {
            maxLen = Math.max(maxLen, String(cell.v).length);
          }
        }
        cols.push({ wch: maxLen + 3 });
      }
      worksheet['!cols'] = cols;
    }

    // Export file
    XLSX.writeFile(workbook, `reporte_endosos_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all font-medium text-sm shadow-sm"
      title="Exportar Reporte a Excel"
    >
      <FileDown className="w-4 h-4" /> Exportar a Excel
    </button>
  );
}
