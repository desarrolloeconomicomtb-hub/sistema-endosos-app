import { prisma } from "@/lib/prisma";
import ConfigClient from "./ConfigClient";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  const eventos = await prisma.evento.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { endosos: true } } }
  });

  const categorias = await prisma.categoria.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { endosos: true } } }
  });

  return (
    <ConfigClient initialEventos={eventos} initialCategorias={categorias} />
  );
}
