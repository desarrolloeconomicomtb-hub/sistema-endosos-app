import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintAction from "../print/PrintAction";
import { QRCodeSVG } from "qrcode.react";

export default async function MarbetePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const endoso = await prisma.endoso.findUnique({
    where: { id: params.id },
    include: {
      evento: true,
      categoria: true,
    }
  });

  if (!endoso) {
    notFound();
  }

  // Verifica si está en cumplimiento
  const isPaid = endoso.reciboPatente || endoso.reciboAmbulante || endoso.reciboBebidas;
  const isExempt = endoso.exentoPago;
  const enCumplimiento = isPaid || isExempt;

  if (!enCumplimiento) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">No Autorizado</h1>
          <p>Este negocio aún no tiene pagos registrados ni está marcado como exento.</p>
        </div>
      </div>
    )
  }

  const headersList = await headers();
  const rawHost = headersList.get("x-forwarded-host") || headersList.get("host") || "sistema-endosos-web.vercel.app";
  const host = rawHost.split(',')[0].trim();
  const protocol = (host.includes("localhost") || host.includes("127.0.0.1")) ? "http" : "https";
  const verificationUrl = `${protocol}://${host}/verificar/${encodeURIComponent(endoso.controlNumber)}`;
  return (
    <div className="bg-gray-200 min-h-screen text-black py-10 flex items-center justify-center print:bg-white print:p-0 print:py-0">
      <PrintAction />
      
      {/* Letter size container */}
      <div className="w-[8.5in] h-[11in] bg-white print:m-0 print:shadow-none shadow-2xl box-border relative flex flex-col items-center justify-between p-12 overflow-hidden border-[24px] border-[#2e5e2e]">
        
        {/* Header with Logo and Escudo */}
        <div className="w-full flex justify-between items-start mb-6">
          <div className="w-1/4 flex justify-start">
            <img src="/images/escudo-toa-baja.png" alt="Escudo Toa Baja" className="h-24 object-contain" />
          </div>
          <div className="flex flex-col items-center justify-center text-center px-2 flex-1">
             <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide mb-1 whitespace-nowrap">Gobierno de Puerto Rico</h2>
             <h3 className="text-lg font-bold text-[#2e5e2e] uppercase whitespace-nowrap">Municipio Autónomo de Toa Baja</h3>
             <p className="text-sm font-semibold text-gray-500 italic mt-1 whitespace-nowrap">Oficina de Finanzas</p>
          </div>
          <div className="w-1/4 flex justify-end">
            <img src="/images/logo-toa-baja.png" alt="Logo Toa Baja" className="h-24 object-contain" />
          </div>
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
            
            <div className="grid grid-cols-2 gap-8 w-full mt-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-right">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Evento Especial</p>
                 <p className="text-2xl font-bold text-[#2e5e2e]">{endoso.evento?.nombre || 'Evento No Asignado'}</p>
              </div>
              <div className="text-left border-l-4 border-[#2e5e2e] pl-8">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Categoría</p>
                 <p className="text-2xl font-bold text-gray-800">{endoso.categoria?.nombre || 'Sin Categoría'}</p>
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
            <a href={verificationUrl} target="_blank" rel="noreferrer" title="Clic para probar la validación">
              <QRCodeSVG value={verificationUrl} size={120} level="H" />
            </a>
            <p className="text-[10px] font-bold text-gray-500 uppercase mt-2">Escanear para verificar</p>
          </div>
        </div>

      </div>
    </div>
  );
}
