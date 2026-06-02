import { prisma } from "@/lib/prisma";
import { BadgeCheck, XCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { registrarVisita } from "@/app/actions";

export default async function VerificarPage(props: { params: Promise<{ controlNumber: string }> }) {
  const params = await props.params;
  const decodedControlNumber = decodeURIComponent(params.controlNumber);

  const endoso = await prisma.endoso.findFirst({
    where: { controlNumber: decodedControlNumber },
    include: {
      evento: true,
      categoria: true,
    }
  });

  if (!endoso) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center border-t-8 border-red-500">
          <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-gray-900 mb-2">INVÁLIDO</h1>
          <p className="text-gray-600 font-medium">Este número de control no existe en nuestros registros oficiales.</p>
          <div className="mt-8 pt-6 border-t border-gray-100">
             <img src="/images/logo-toa-baja.png" alt="Logo Toa Baja" className="h-16 mx-auto opacity-50 grayscale" />
          </div>
        </div>
      </div>
    );
  }

  const isPaid = endoso.reciboPatente || endoso.reciboAmbulante || endoso.reciboBebidas;
  const isExempt = endoso.exentoPago;
  const enCumplimiento = isPaid || isExempt;

  if (!enCumplimiento) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center border-t-8 border-red-500">
          <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-gray-900 mb-2">NO AUTORIZADO</h1>
          <p className="text-gray-600 font-medium">Este negocio tiene pagos o requerimientos pendientes con el municipio.</p>
          <div className="mt-8 bg-gray-50 p-4 rounded-lg text-left">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Negocio</p>
            <p className="text-lg font-bold text-gray-900">{endoso.companyName}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2e5e2e] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center overflow-hidden relative">
        
        {/* Background accent */}
        <div className="absolute top-0 left-0 w-full h-32 bg-green-50 z-0 border-b border-green-100"></div>

        <div className="relative z-10">
          <BadgeCheck className="w-28 h-28 text-green-500 mx-auto mb-4 drop-shadow-md bg-white rounded-full p-2" />
          
          <h1 className="text-4xl font-black text-green-600 mb-1 tracking-tight">VÁLIDO</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">En Cumplimiento</p>
          
          <div className="space-y-4 text-left">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nombre del Negocio</p>
              <p className="text-xl font-black text-gray-900 leading-tight">{endoso.companyName}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Evento</p>
                <p className="text-sm font-bold text-[#2e5e2e]">{endoso.evento?.nombre || 'Evento No Asignado'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Categoría</p>
                <p className="text-sm font-bold text-gray-800">{endoso.categoria?.nombre || 'Sin Categoría'}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Control Interno</p>
              <p className="font-mono font-bold text-gray-700 text-sm">{endoso.controlNumber}</p>
            </div>
          </div>

          {endoso.visitedAt ? (
            <div className="mt-8 bg-green-100 border border-green-200 text-green-800 p-4 rounded-xl text-left shadow-inner">
              <p className="text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><BadgeCheck className="w-4 h-4"/> Inspección Oficial Registrada</p>
              <p className="text-sm font-medium">Visitado el {endoso.visitedAt.toLocaleDateString('es-PR')} a las {endoso.visitedAt.toLocaleTimeString('es-PR')}</p>
            </div>
          ) : (
            <form action={registrarVisita} className="mt-8">
              <input type="hidden" name="id" value={endoso.id} />
              <input type="hidden" name="controlNumber" value={endoso.controlNumber} />
              <button type="submit" className="w-full bg-[#2e5e2e] text-white font-bold py-4 rounded-xl border-b-4 border-[#1b3d1b] hover:bg-[#3b733b] transition-all shadow-lg active:translate-y-1 active:border-b-0">
                REGISTRAR VISITA HOY
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-4">
             <img src="/images/escudo-toa-baja.png" alt="Escudo" className="h-12" />
             <div className="text-left">
               <p className="text-[10px] font-bold text-gray-400 uppercase">Validación Oficial</p>
               <p className="text-xs font-bold text-gray-800">Municipio de Toa Baja</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
