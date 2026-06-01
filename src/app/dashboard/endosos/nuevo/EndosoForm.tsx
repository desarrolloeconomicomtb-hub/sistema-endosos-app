'use client';

import { useState, useEffect } from 'react';
import { createEndoso, getNextSequence, updateEndoso } from '@/app/actions';
import { FileEdit } from 'lucide-react';

export default function EndosoForm({ eventos = [], initialData, error }: { eventos?: any[], initialData?: any, error?: string }) {
  const [evento, setEvento] = useState(() => initialData ? initialData.controlNumber.split('-')[0] : 'FFC');
  const [tipo, setTipo] = useState(() => initialData ? initialData.controlNumber.split('-')[2] : 'CO');
  const [controlNumber, setControlNumber] = useState(initialData?.controlNumber || 'Generando...');
  const [isExento, setIsExento] = useState(initialData?.exentoPago || false);

  useEffect(() => {
    async function fetchSequence() {
      if (initialData) return; // Si es edición, no buscar nueva secuencia
      if (evento && tipo) {
        setControlNumber('Generando...');
        try {
          const nextSeq = await getNextSequence(evento);
          const year = new Date().getFullYear();
          setControlNumber(`${evento}-MTB-${tipo}-${nextSeq.toString().padStart(3, '0')}-${year}`);
        } catch (error) {
          setControlNumber('Error de conexión');
        }
      } else {
        setControlNumber('');
      }
    }
    fetchSequence();
  }, [evento, tipo, initialData]);

  return (
    <form action={initialData ? updateEndoso.bind(null, initialData.id) : createEndoso} className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Formato Excel */}
      <div className="bg-[#2e5e2e] text-white py-3 px-4 flex items-center justify-center gap-2 font-bold text-lg border border-[#1b3d1b]">
        <FileEdit className="w-5 h-5" />
        {initialData ? 'EDICIÓN DE ENDOSO' : 'ENTRADA DE DATOS - NUEVO ENDOSO'}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm text-red-700 text-sm flex items-start gap-2">
          <span className="font-bold">Error:</span>
          <span>{decodeURIComponent(error)}</span>
        </div>
      )}

      <input type="hidden" name="controlNumber" value={controlNumber} />
      <input type="hidden" name="eventoCode" value={evento} />
      <input type="hidden" name="tipoCode" value={tipo} />

      {/* Grid container Excel-like */}
      <div className="border border-gray-300 shadow-sm bg-white">
        
        {/* EVENTO SECTION */}
        <div className="grid grid-cols-[14rem_1fr] border-b border-gray-300">
          <div className="bg-[#3b733b] text-white px-4 py-2 font-bold text-sm flex items-center border-r border-gray-300">
            EVENTO *
          </div>
          <div>
            <input 
              type="text"
              list="eventos-list"
              value={evento}
              onChange={(e) => setEvento(e.target.value.toUpperCase())}
              placeholder="Ej. FFC, CAR, u otro..."
              className="w-full h-full min-h-[36px] bg-[#fff599] border-none px-3 py-2 text-sm focus:ring-0 focus:outline-none uppercase"
            />
            <datalist id="eventos-list">
              {eventos.map((ev) => (
                <option key={ev.codigo} value={ev.codigo || ''}>{ev.codigo} ({ev.companyName})</option>
              ))}
            </datalist>
          </div>
        </div>

        <div className="grid grid-cols-[14rem_1fr] border-b border-gray-300">
          <div className="bg-[#3b733b] text-white px-4 py-2 font-bold text-sm flex items-center border-r border-gray-300">
            TIPO DE ACTIVIDAD *
          </div>
          <div>
            <select 
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full h-full min-h-[36px] bg-[#fff599] border-none px-3 py-2 text-sm focus:ring-0 focus:outline-none"
            >
              <option value="CO">CO (Comida)</option>
              <option value="BE">BE (Bebida)</option>
              <option value="AR">AR (Artesanías)</option>
              <option value="PS">PS (Productos y Servicios)</option>
              <option value="PICA">PICA (Pica)</option>
              <option value="MISC">MISC (Misceláneos)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-[14rem_1fr] border-b-8 border-white">
          <div className="bg-[#d3d3d3] text-white px-4 py-2 font-bold text-sm flex items-center border-r border-gray-300 uppercase">
            Número de Control (Automático)
          </div>
          <div className="bg-[#d4edd4] flex items-center px-3 py-2 text-sm font-bold text-[#1f4a1f] min-h-[36px]">
            {controlNumber}
          </div>
        </div>

        {/* NEGOCIO SECTION */}
        <div className="grid grid-cols-[14rem_1fr] border-b border-gray-300 border-t border-gray-300 mt-4">
          <div className="bg-[#3b733b] text-white px-4 py-2 font-bold text-sm flex items-center border-r border-gray-300">
            NOMBRE DEL NEGOCIO *
          </div>
          <div>
            <input type="text" name="companyName" defaultValue={initialData?.companyName} required className="w-full h-full min-h-[36px] bg-[#fff599] border-none px-3 py-2 text-sm focus:ring-0 focus:outline-none" />
          </div>
        </div>
        
        <div className="grid grid-cols-[14rem_1fr] border-b border-gray-300">
          <div className="bg-[#3b733b] text-white px-4 py-2 font-bold text-sm flex items-center border-r border-gray-300">
            REPRESENTANTE
          </div>
          <div>
            <input type="text" name="representante" defaultValue={initialData?.representante} className="w-full h-full min-h-[36px] bg-[#fff599] border-none px-3 py-2 text-sm focus:ring-0 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-[14rem_1fr] border-b border-gray-300">
          <div className="bg-[#3b733b] text-white px-4 py-2 font-bold text-sm flex items-center border-r border-gray-300">
            TELÉFONO
          </div>
          <div>
            <input type="text" name="telefono" defaultValue={initialData?.telefono} className="w-full h-full min-h-[36px] bg-[#fff599] border-none px-3 py-2 text-sm focus:ring-0 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-[14rem_1fr] border-b border-gray-300">
          <div className="bg-[#3b733b] text-white px-4 py-2 font-bold text-sm flex items-center border-r border-gray-300">
            EMAIL
          </div>
          <div>
            <input type="email" name="email" defaultValue={initialData?.email} className="w-full h-full min-h-[36px] bg-[#fff599] border-none px-3 py-2 text-sm focus:ring-0 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-[14rem_1fr] border-b-8 border-white">
          <div className="bg-[#3b733b] text-white px-4 py-2 font-bold text-sm flex items-center border-r border-gray-300">
            DESCRIPCIÓN
          </div>
          <div>
            <input type="text" name="descripcion" defaultValue={initialData?.descripcion} className="w-full h-full min-h-[36px] bg-[#fff599] border-none px-3 py-2 text-sm focus:ring-0 focus:outline-none" />
          </div>
        </div>

        {/* EVENT DETAILS SECTION */}
        <div className="grid grid-cols-[14rem_1fr] border-b border-gray-300 border-t border-gray-300 mt-4">
          <div className="bg-[#3b733b] text-white px-4 py-2 font-bold text-sm flex items-center border-r border-gray-300">
            FECHAS EVENTO
          </div>
          <div>
            <input type="text" name="issueDatesEvento" defaultValue={initialData?.issueDatesEvento || "15-17 mayo"} className="w-full h-full min-h-[36px] bg-[#fff599] border-none px-3 py-2 text-sm focus:ring-0 focus:outline-none" />
          </div>
        </div>
        
        <div className="grid grid-cols-[14rem_1fr]">
          <div className="bg-[#3b733b] text-white px-4 py-2 font-bold text-sm flex items-center border-r border-gray-300">
            UBICACIÓN
          </div>
          <div>
            <input type="text" name="ubicacion" defaultValue={initialData?.ubicacion || "Balneario Punta Salinas"} className="w-full h-full min-h-[36px] bg-[#fff599] border-none px-3 py-2 text-sm focus:ring-0 focus:outline-none" />
          </div>
        </div>

        {/* SECCIÓN DE PAGOS */}
        <div className="md:col-span-2 mt-4 p-4 border border-gray-300 bg-gray-50 rounded">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#2e5e2e]">SECCIÓN DE PAGOS Y RECIBOS</h3>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm hover:bg-gray-100 transition-colors">
              <input 
                type="checkbox" 
                name="exentoPago" 
                checked={isExento}
                onChange={(e) => setIsExento(e.target.checked)}
                className="w-4 h-4 text-[#2e5e2e] rounded focus:ring-[#2e5e2e]"
              />
              Entidad Exenta de Pago
            </label>
          </div>

          {isExento ? (
            <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-[#1b3d1b]">
              <div className="bg-[#2e5e2e] text-white p-3 font-bold text-sm flex items-center md:col-span-1">
                RAZÓN DE EXENCIÓN *
              </div>
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  name="exentoRazon" 
                  defaultValue={initialData?.exentoRazon || ''} 
                  required={isExento}
                  placeholder="Ej. Entidad Sin Fines de Lucro, Agencia de Gobierno..." 
                  className="w-full h-full min-h-[36px] bg-[#fff599] border-none px-3 py-2 text-sm focus:ring-0 focus:outline-none" 
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-gray-300 border border-[#1b3d1b]">
              <div className="bg-white grid grid-cols-1 md:grid-cols-3">
                <div className="bg-[#2e5e2e] text-white p-3 font-bold text-sm flex items-center">
                  RECIBO PATENTE
                </div>
                <div className="md:col-span-2">
                  <input type="text" name="reciboPatente" defaultValue={initialData?.reciboPatente || ''} placeholder="Opcional" className="w-full h-full min-h-[36px] bg-[#fff599] border-none px-3 py-2 text-sm focus:ring-0 focus:outline-none" />
                </div>
              </div>
              
              <div className="bg-white grid grid-cols-1 md:grid-cols-3">
                <div className="bg-[#2e5e2e] text-white p-3 font-bold text-sm flex items-center">
                  RECIBO NEGOCIO AMBULANTE
                </div>
                <div className="md:col-span-2">
                  <input type="text" name="reciboAmbulante" defaultValue={initialData?.reciboAmbulante || ''} placeholder="Opcional" className="w-full h-full min-h-[36px] bg-[#fff599] border-none px-3 py-2 text-sm focus:ring-0 focus:outline-none" />
                </div>
              </div>

              <div className="bg-white grid grid-cols-1 md:grid-cols-3 md:col-span-2">
                <div className="bg-[#2e5e2e] text-white p-3 font-bold text-sm flex items-center md:col-span-1 border-r border-[#1b3d1b]">
                  RECIBO BEBIDAS
                </div>
                <div className="md:col-span-2">
                  <input type="text" name="reciboBebidas" defaultValue={initialData?.reciboBebidas || ''} placeholder="Opcional (solo si aplica)" className="w-full h-full min-h-[36px] bg-[#fff599] border-none px-3 py-2 text-sm focus:ring-0 focus:outline-none" />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="mt-8 flex justify-center">
        <button 
          type="submit" 
          disabled={!controlNumber}
          className="bg-[#2e5e2e] text-white font-bold py-3 px-8 rounded border-b-4 border-[#1b3d1b] hover:bg-[#3b733b] hover:border-[#2e5e2e] active:border-b-0 active:mt-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {initialData ? 'GUARDAR CAMBIOS' : 'REGISTRAR ENDOSO'}
        </button>
      </div>

    </form>
  );
}
