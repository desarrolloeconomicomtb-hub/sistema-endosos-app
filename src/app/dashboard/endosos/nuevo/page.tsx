import { prisma } from "@/lib/prisma"
import EndosoForm from "./EndosoForm"

export default async function NuevoEndosoPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

  const eventos = await prisma.evento.findMany({
    where: { codigo: { not: null } }
  });

  const categorias = await prisma.categoria.findMany({
    orderBy: { nombre: 'asc' }
  });

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Endoso</h2>
      </div>
      
      <EndosoForm eventos={eventos} categorias={categorias} error={error} />
    </div>
  );
}
