import { prisma } from "@/lib/prisma"
import EndosoForm from "../../nuevo/EndosoForm"
import { notFound } from "next/navigation"

export default async function EditarEndosoPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const endoso = await prisma.endoso.findUnique({
    where: { id: params.id }
  });

  if (!endoso) {
    notFound();
  }

  const eventos = await prisma.evento.findMany({
    where: { codigo: { not: null } }
  });

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Añadir Recibos / Editar Endoso</h2>
        <p className="text-sm text-gray-500">Endoso: {endoso.controlNumber}</p>
      </div>
      
      <EndosoForm eventos={eventos} initialData={endoso} />
    </div>
  );
}
