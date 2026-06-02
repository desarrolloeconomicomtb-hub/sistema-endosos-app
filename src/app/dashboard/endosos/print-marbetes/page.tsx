import { prisma } from "@/lib/prisma";
import { QRCodeSVG } from "qrcode.react";
import PrintAction from "../[id]/print/PrintAction";
import { headers } from "next/headers";

export default async function PrintMarbetesPage(props: { searchParams: Promise<{ eventoId?: string }> }) {
  const searchParams = await props.searchParams;
  
  const endosos = await prisma.endoso.findMany({
    where: {
      eventoId: searchParams.eventoId || undefined,
      OR: [
        { exentoPago: true },
        { reciboPatente: { not: null } },
        { reciboAmbulante: { not: null } },
        { reciboBebidas: { not: null } }
      ]
    },
    include: { evento: true, categoria: true },
    orderBy: { companyName: 'asc' }
  });

  if (endosos.length === 0) {
    return <div className="p-10 text-center font-bold text-xl">No hay marbetes válidos para imprimir bajo este filtro.</div>;
  }

  const headersList = await headers();
  const rawHost = headersList.get("x-forwarded-host") || headersList.get("host") || "sistema-endosos-web.vercel.app";
  const host = rawHost.split(',')[0].trim();
  const protocol = (host.includes("localhost") || host.includes("127.0.0.1")) ? "http" : "https";

  return (
    <div className="print:bg-white bg-gray-200 min-h-screen py-10 flex flex-col items-center gap-10 print:py-0 print:gap-0 print:block">
      <PrintAction />
      
      {endosos.map((endoso, index) => {
        const verificationUrl = `${protocol}://${host}/verificar/${encodeURIComponent(endoso.controlNumber)}`; 
        
        return (
          <div key={endoso.id} className={`w-[8.5in] h-[11in] bg-white print:m-0 print:shadow-none shadow-2xl box-border relative flex flex-col items-center justify-between p-12 overflow-hidden border-[24px] border-[#2e5e2e] ${index !== endosos.length - 1 ? 'break-after-page' : ''}`}>
            
            {/* Header with Logo and Escudo */}
            <div className="w-full flex justify-between items-start mb-6">
              <img src="/images/escudo-toa-baja.png" alt="Escudo Toa Baja" className="h-32 object-contain" />
              <div className="flex flex-col items-center text-center px-4">
                 <h2 className="text-2xl font-black text-gray-800 uppercase tracking-widest mb-1">Gobierno de Puerto Rico</h2>
                 <h3 className="text-lg font-bold text-[#2e5e2e] uppercase">Municipio Autónomo de Toa Baja</h3>
                 <p className="text-sm font-semibold text-gray-500 italic mt-1">Oficina de Finanzas</p>
              </div>
              <img src="/images/logo-toa-baja.png" alt="Logo Toa Baja" className="h-32 object-contain" />
            </div>

            {/* Title */}
            <div className="text-center w-full flex-grow flex flex-col justify-center items-center">
              
              <div className="bg-[#2e5e2e] text-white w-[120%] py-8 -mx-12 mb-12 transform -rotate-2 shadow-2xl border-y-8 border-[#fff599]">
                <h1 className="text-7xl font-black text-center tracking-tighter uppercase drop-shadow-md">
                  EN CUMPLIMIENTO
                </h1>
              </div>

              <div className="space-y-8 w-full text-center">
                <div className="bg-gray-50 py-6 px-10 rounded-2xl inline-block border-2 border-gray-200 w-full shadow-inner">
                   <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Establecimiento Autorizado</p>
                   <p className="text-5xl font-black text-gray-900 leading-tight">{endoso.companyName}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 w-full mt-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-right pr-4">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Evento Especial</p>
                     <p className="text-lg font-bold text-[#2e5e2e]">{endoso.evento?.nombre || 'Evento No Asignado'}</p>
                  </div>
                  <div className="text-center border-x-2 border-[#2e5e2e] px-4 flex flex-col justify-center">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tarima / Área</p>
                     <p className="text-lg font-black text-amber-600 uppercase leading-none mt-1">{endoso.tarima || 'General'}</p>
                  </div>
                  <div className="text-left pl-4">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Categoría</p>
                     <p className="text-lg font-bold text-gray-800">{endoso.categoria?.nombre || 'Sin Categoría'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with QR */}
            <div className="w-full mt-8 flex justify-between items-end border-t-4 border-gray-200 pt-6">
              <div className="text-left">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Número de Control Oficial</p>
                <p className="font-mono text-3xl font-black text-gray-800 tracking-wider bg-gray-100 px-3 py-1 rounded inline-block">{endoso.controlNumber}</p>
                <p className="text-sm font-semibold text-gray-500 mt-4">Válido para las fechas: <span className="text-gray-800">{endoso.fechasEvento}</span></p>
              </div>
              <div className="bg-white p-3 border-4 border-[#2e5e2e] rounded-xl shadow-lg flex flex-col items-center">
                <QRCodeSVG value={verificationUrl} size={120} level="H" />
                <p className="text-[10px] font-bold text-gray-500 uppercase mt-2">Escanear para verificar</p>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
