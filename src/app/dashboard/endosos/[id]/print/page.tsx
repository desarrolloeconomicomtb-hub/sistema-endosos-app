import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintAction from "./PrintAction";

export default async function PrintEndosoPage(
  props: { 
    params: Promise<{ id: string }>,
    searchParams: Promise<{ companyName?: string, puesto?: string }>
  }
) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const endoso = await prisma.endoso.findUnique({
    where: { id: params.id },
    include: {
      evento: true,
      categoria: true
    }
  });

  if (!endoso) return notFound();

  const issueDateActual = new Date().toLocaleDateString('es-PR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Custom or fallback firmante
  const firmaNombre = searchParams.companyName || endoso.firmanteNombre || 'Shirley Torres Reyes';
  const firmaPuesto = searchParams.puesto || endoso.firmantePuesto || 'Ayudante Especial';
  const firmaExtension = endoso.firmanteExtension || '2133';
  const firmaEmail = endoso.firmanteEmail || 'storres@toabaja.com';

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Print Controls (hidden on print) */}
      <PrintAction />

      {/* A4/Letter Page Container */}
      <div className="max-w-[8.5in] mx-auto bg-white print:m-0 print:shadow-none shadow-sm min-h-[11in] p-[1in] box-border relative text-[11pt] font-sans leading-relaxed flex flex-col text-black">
        
        {/* Header / Logos */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex flex-col items-center w-40">
            <img src="/images/escudo-toa-baja.png" alt="Escudo Toa Baja" className="w-20 h-auto mb-1" />
            <div className="h-4 w-[1px] bg-black mb-1"></div>
            <p className="text-[6pt] text-center leading-tight whitespace-nowrap">Hon. Bernardo "Betito" Márquez García</p>
            <p className="text-[6pt] text-center">Alcalde</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-[11pt]">Gobierno de Puerto Rico</p>
            <p className="text-[14pt] font-bold text-[#1b5e20]">Municipio Autónomo de Toa Baja</p>
            <p className="text-[11pt] italic">Oficina del Alcalde</p>
          </div>
          <div className="w-32 flex justify-end">
            <img src="/images/logo-toa-baja.png" alt="Logo Toa Baja" className="w-32 h-auto" />
          </div>
        </div>

        {/* Date */}
        <div className="mb-4">
          <p>{issueDateActual}</p>
        </div>

        {/* Control Number */}
        <div className="flex justify-end mb-8">
          <div className="border border-[#1b5e20] px-4 py-1 text-[10pt] font-bold text-[#1b5e20]">
            Núm. Control: {endoso.controlNumber.replace(/-/g, '_')}
          </div>
        </div>

        {/* Addressee */}
        <div className="mb-6">
          <p className="font-bold">{endoso.representante || '[Nombre del Representante]'}</p>
          <p>{endoso.companyName}</p>
          <p>{endoso.ubicacion || 'Toa Baja, PR'}</p>
        </div>

        {/* Salutation */}
        <div className="mb-4">
          <p>Estimado/a {endoso.representante || '[Nombre del Representante]'}:</p>
        </div>

        {/* Body Paragraphs */}
        <div className="space-y-4 text-justify flex-1 text-[10.5pt]">
          <p>
            Reciba un cordial saludo de parte de todos los que laboramos en el Municipio de Toa Baja. Hemos recibido su petición para participar en la categoriaId denominada {endoso.evento.companyName}, a celebrarse los días {endoso.evento.issueDates || '15, 16 y 17 de mayo de 2026'}, en {endoso.evento.ubicacion || 'el Balneario de Punta Salinas, Toa Baja, Puerto Rico'}.
          </p>

          <p>
            El Municipio de Toa Baja ha evaluado su petición y no tiene objeción en que opere (1) quiosco provisional para la venta de <strong>{endoso.descripcion || '[Descripción de venta]'}</strong>. No obstante, el otorgamiento de este endoso está sujeto a que se cumplan con todos los requerimientos establecidos por ley, reglamento u ordenanza en vigor aplicable, así como realizar los trámites correspondientes con el personal de la Oficina de Finanzas Municipales.
          </p>

          <p>
            Igualmente, si su intención es la venta de bebidas alcohólicas, deberá obtener el endoso o licencia correspondiente otorgada por el Departamento de Hacienda para esos fines.
          </p>

          <p>
            Este endoso representa un visto bueno del Municipio en la obtención de cualquier permiso, licencia y/o trámite gubernamental requerido para que el proponente lleve a cabo su propósito.
          </p>

          <p>
            El Municipio interesa mantener el más alto grado de coordinación y logística para asegurar que esta categoriaId tenga el éxito que todos esperamos. Confiamos en que la aportación que usted pueda brindar para el desarrollo de la {endoso.evento.companyName} la convierta en un evento que sea considerado por nuestros ciudadanos un verdadero Orgullo Llanero.
          </p>
        </div>

        {/* Sign-off */}
        <div className="mt-8">
          <p className="mb-10">Cordialmente,</p>
          
          <div>
            <p className="font-bold">{firmaNombre}</p>
            <p>{firmaPuesto}</p>
            <p>Municipio Autónomo de Toa Baja</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto text-center text-[7pt] text-gray-500 border-t-2 border-[#1b5e20] pt-2 pb-2">
          Dirección: Apartado 2359, Toa Baja, P.R. 00951 &nbsp;&nbsp;|&nbsp;&nbsp; Teléfono: (787) 261-0202 &nbsp;&nbsp;|&nbsp;&nbsp; Extensión: {firmaExtension} &nbsp;&nbsp;|&nbsp;&nbsp; Correo Electrónico: {firmaEmail}
        </div>

      </div>
    </div>
  );
}
