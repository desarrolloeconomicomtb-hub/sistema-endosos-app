import { prisma } from "@/lib/prisma"
import EndosoForm from "./EndosoForm"

export default async function NuevoEndosoPage() {
  const eventos = await prisma.evento.findMany({
    where: { codigo: { not: null } }
  });

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Endoso</h2>
      </div>
      
      <EndosoForm eventos={eventos} />
    </div>
  );
}
