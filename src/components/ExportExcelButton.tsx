'use client';

import * as XLSX from 'xlsx';
import { FileDown } from 'lucide-react';

interface ExportExcelButtonProps {
  data: any[];
}

export default function ExportExcelButton({ data }: ExportExcelButtonProps) {
  const handleExport = () => {
    // Map the Prisma data structure to clean Spanish headers for the Excel file
    const formattedData = data.map(item => ({
      'Número de Control': item.controlNumber,
      'Proponente / Negocio': item.companyName,
      'Representante': item.representante || '',
      'Teléfono': item.telefono || '',
      'Correo Electrónico': item.email || '',
      'Descripción': item.descripcion || '',
      'Evento': item.evento?.nombre || 'Sin Evento',
      'Categoría': item.categoria?.nombre || 'Sin Categoría',
      'Ubicación': item.ubicacion,
      'Tarima': item.tarima || '',
      'Recibo Patente': item.reciboPatente || '',
      'Recibo Ambulante': item.reciboAmbulante || '',
      'Recibo Bebidas': item.reciboBebidas || '',
      'Exento de Pago': item.exentoPago ? 'Sí' : 'No',
      'Razón de Exención': item.exentoRazon || '',
      'Estatus': item.status,
      'Inspección': item.visitedAt ? new Date(item.visitedAt).toLocaleDateString('es-PR') : 'Pendiente',
      'Fecha Emisión': new Date(item.issueDate).toLocaleDateString('es-PR')
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Endosos');
    
    // Auto-fit column widths
    const maxColumnWidths = formattedData.reduce((acc: any, row: any) => {
      Object.keys(row).forEach((key, colIndex) => {
        const valLength = String(row[key] || '').length;
        const keyLength = key.length;
        const length = Math.max(valLength, keyLength) + 3;
        if (!acc[colIndex] || acc[colIndex] < length) {
          acc[colIndex] = length;
        }
      });
      return acc;
    }, []);
    
    worksheet['!cols'] = maxColumnWidths.map((w: number) => ({ w }));

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
