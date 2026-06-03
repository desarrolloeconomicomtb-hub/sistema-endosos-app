import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import PrintButton from "./PrintButton";

export default async function ImprimirEndosoPage({ params }: { params: { id: string } }) {
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

  // Format dates manually to match "12 de mayo de 2026"
  const issueDate = new Date(endoso.issueDate);
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const formattedIssueDate = `${issueDate.getDate()} de ${months[issueDate.getMonth()]} de ${issueDate.getFullYear()}`;

  const rep = (endoso.representante || '').trim();
  const lowerRep = rep.toLowerCase();
  
  let saludo = `Estimado(a) ${rep || endoso.companyName}:`;
  let addresseeLine = rep;

  if (rep === '' || lowerRep === 'representante' || lowerRep === 'representantes' || lowerRep === 'representante autorizado') {
    saludo = `Estimados representantes de ${endoso.companyName}:`;
    addresseeLine = '';
  } else if (lowerRep === 'señores' || lowerRep === 'senores' || lowerRep === 'entidad') {
    saludo = 'Estimados señores:';
    addresseeLine = '';
  } else if (lowerRep.startsWith('sr. ')) {
    saludo = `Estimado señor ${rep.substring(4)}:`;
  } else if (lowerRep.startsWith('sra. ')) {
    saludo = `Estimada señora ${rep.substring(5)}:`;
  } else if (lowerRep.startsWith('srta. ')) {
    saludo = `Estimada señorita ${rep.substring(6)}:`;
  } else if (lowerRep.startsWith('dr. ')) {
    saludo = `Estimado doctor ${rep.substring(4)}:`;
  } else if (lowerRep.startsWith('dra. ')) {
    saludo = `Estimada doctora ${rep.substring(5)}:`;
  } else if (lowerRep.startsWith('ing. ')) {
    saludo = `Estimado ingeniero ${rep.substring(5)}:`;
  } else if (lowerRep.startsWith('inga. ')) {
    saludo = `Estimada ingeniera ${rep.substring(6)}:`;
  } else if (lowerRep.startsWith('lic. ')) {
    saludo = `Estimado licenciado ${rep.substring(5)}:`;
  } else if (lowerRep.startsWith('lica. ')) {
    saludo = `Estimada licenciada ${rep.substring(6)}:`;
  }

  return (
    <div className="bg-white min-h-screen text-black font-sans w-[8.5in] mx-auto p-0 print:p-0">
      {/* Container for the page with Letter margins */}
      <div className="px-12 py-6 flex flex-col min-h-[11in] relative text-[10.5pt] leading-normal">
        
        {/* Header section */}
        <div className="flex justify-between items-start mb-6">
          {/* Left logo (Escudo) */}
          <div className="w-40 text-center flex flex-col items-center">
            <img src="/images/escudo.png" alt="Escudo Toa Baja" className="h-24 w-auto object-contain mb-1" />
            <div className="text-[9px] leading-tight text-black font-semibold">
              <p>Hon. Bernardo "Betito"</p>
              <p>Márquez García</p>
              <p>Alcalde</p>
            </div>
          </div>

          {/* Center text */}
          <div className="text-center flex-1 pt-2">
            <p className="text-xs font-medium">Gobierno de Puerto Rico</p>
            <h1 className="text-lg font-bold text-green-800 uppercase mt-0.5 mb-0.5">
              Municipio Autónomo de Toa Baja
            </h1>
            <p className="text-sm italic">Oficina del Alcalde</p>
          </div>

          {/* Right logo (Toa Baja Logo) */}
          <div className="w-40 flex justify-end">
            <img src="/images/logo.png" alt="Logo Toa Baja" className="h-14 w-auto object-contain mt-1" />
          </div>
        </div>

        {/* Date */}
        <div className="mb-4">
          <p className="text-[10.5pt]">{formattedIssueDate}</p>
        </div>

        {/* Control Number Box */}
        <div className="flex justify-end mb-4">
          <div className="border border-green-800 px-3 py-0.5">
            <p className="font-bold text-xs text-green-800 tracking-wide">
              Núm. Control: {endoso.controlNumber}
            </p>
          </div>
        </div>

        {/* Addressee */}
        <div className="mb-4 text-[10.5pt] font-bold leading-tight">
          {addresseeLine && <p>{addresseeLine}</p>}
          <p>{endoso.companyName}</p>
          <p>{endoso.address}</p>
        </div>

        {/* Body */}
        <div className="text-[10.5pt] leading-relaxed text-justify space-y-3">
          <p>
            {saludo}
          </p>

          <p>
            Reciba un cordial saludo de parte de todos los que laboramos en el Municipio de Toa Baja. Hemos
            recibido su petición para participar en la categoriaId denominada {endoso.evento.companyName}, a celebrarse
            los días {endoso.evento.issueDates}, en el {endoso.evento.ubicacion}{endoso.tarima ? ` (área adyacente a ${endoso.tarima})` : ''}.
          </p>

          <p>
            El Municipio de Toa Baja ha evaluado su petición y no tiene objeción en que opere (1) quiosco provisional
            para la venta de <strong>{endoso.categoria.companyName}</strong>. No obstante, el otorgamiento de este endoso está sujeto a
            que se cumplan con todos los requerimientos establecidos por ley, reglamento u ordenanza en vigor
            aplicable, así como realizar los trámites correspondientes con el personal de la Oficina de Finanzas
            Municipales.
          </p>

          <p>
            Igualmente, si su intención es la venta de bebidas alcohólicas, deberá obtener el endoso o licencia
            correspondiente otorgada por el Departamento de Hacienda para esos fines.
          </p>

          <p>
            Este endoso representa un visto bueno del Municipio en la obtención de cualquier permiso, licencia y/o
            trámite gubernamental requerido para que el proponente lleve a cabo su propósito.
          </p>

          <p>
            El Municipio interesa mantener el más alto grado de coordinación y logística para asegurar que esta
            categoriaId tenga el éxito que todos esperamos. Confiamos en que la aportación que usted pueda brindar
            para el desarrollo de la {endoso.evento.companyName} la convierta en un evento que sea considerado por
            nuestros ciudadanos un verdadero Orgullo Llanero.
          </p>
        </div>

        {/* Closing */}
        <div className="mt-4 mb-8 text-[10.5pt]">
          <p>Cordialmente,</p>
        </div>

        {/* Signature Area (Blank as requested) */}
        <div className="mb-4 text-[10.5pt]">
          <p className="font-bold">Óscar Rodríguez Estrella</p>
          <p>Vicealcalde</p>
          <p>Municipio Autónomo de Toa Baja</p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-2 border-t border-green-800 text-center text-[8pt] text-gray-600 pb-2">
          <p>
            Dirección: Apartado 2359, Toa Baja, P.R. 00951 &nbsp;|&nbsp; Teléfono: (787) 261-0202 &nbsp;|&nbsp; Correo Electrónico: orodriguez1@toabaja.com
          </p>
        </div>
        
      </div>
      
      {/* Non-printable utilities */}
      <div className="fixed bottom-8 right-8 print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}
