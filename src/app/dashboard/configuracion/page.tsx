import { prisma } from "@/lib/prisma";
import { 
  createEventAction, 
  deleteEventAction, 
  createCategoryAction, 
  deleteCategoryAction 
} from "./actions";
import { Settings, Calendar, Tag, Trash2, Plus, AlertCircle } from "lucide-react";

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
    <div className="space-y-10">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-gray-700" />
          Configuración del Sistema
        </h1>
        <p className="text-gray-500 mt-2">Administra los eventos activos y las categorías de negocios disponibles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Sección Eventos */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <Calendar className="w-5 h-5 text-green-600" />
              Eventos Activos
            </h2>

            {/* Formulario Agregar Evento */}
            <form action={createEventAction} className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200/60">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Crear Nuevo Evento</h3>
              <div className="grid grid-cols-3 gap-2">
                <input 
                  type="text" 
                  name="codigo" 
                  placeholder="Cod (e.g. FFC)" 
                  required 
                  className="px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-400 bg-white"
                />
                <input 
                  type="text" 
                  name="nombre" 
                  placeholder="Nombre del Evento" 
                  required 
                  className="col-span-2 px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-400 bg-white"
                />
              </div>
              <input 
                type="text" 
                name="fechas" 
                placeholder="Fechas (e.g. 15, 16 y 17 de mayo)" 
                required 
                className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-400 bg-white"
              />
              <input 
                type="text" 
                name="ubicacion" 
                placeholder="Ubicación" 
                required 
                className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-400 bg-white"
              />
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#2e5e2e] text-white py-1.5 px-4 rounded text-sm font-medium hover:bg-[#1b3d1b] transition-colors"
              >
                <Plus className="w-4 h-4" /> Registrar Evento
              </button>
            </form>

            {/* Lista de Eventos */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {eventos.length === 0 ? (
                <p className="text-center py-6 text-sm text-gray-400">No hay eventos registrados.</p>
              ) : (
                eventos.map((evento) => (
                  <div key={evento.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50/50 transition-colors group">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">
                          {evento.codigo}
                        </span>
                        <h4 className="font-semibold text-sm text-gray-900">{evento.nombre}</h4>
                      </div>
                      <p className="text-xs text-gray-500">{evento.fechas} &bull; {evento.ubicacion}</p>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{evento._count.endosos} Endosos</p>
                    </div>
                    {evento._count.endosos === 0 ? (
                      <form action={async () => {
                        'use server';
                        await deleteEventAction(evento.id);
                      }}>
                        <button type="submit" className="text-gray-400 hover:text-red-600 p-1.5 rounded transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded" title="No se puede eliminar con endosos activos">
                        Activo
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sección Categorías */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <Tag className="w-5 h-5 text-yellow-600" />
              Categorías de Negocios
            </h2>

            {/* Formulario Agregar Categoría */}
            <form action={createCategoryAction} className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200/60">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Crear Nueva Categoría</h3>
              <input 
                type="text" 
                name="nombre" 
                placeholder="Nombre de la Categoría (e.g. Comida, Bebida)" 
                required 
                className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-400 bg-white"
              />
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#2e5e2e] text-white py-1.5 px-4 rounded text-sm font-medium hover:bg-[#1b3d1b] transition-colors"
              >
                <Plus className="w-4 h-4" /> Registrar Categoría
              </button>
            </form>

            {/* Lista de Categorías */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {categorias.length === 0 ? (
                <p className="text-center py-6 text-sm text-gray-400">No hay categorías registradas.</p>
              ) : (
                categorias.map((cat) => (
                  <div key={cat.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50/50 transition-colors group">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">{cat.nombre}</h4>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{cat._count.endosos} Endosos</p>
                    </div>
                    {cat._count.endosos === 0 ? (
                      <form action={async () => {
                        'use server';
                        await deleteCategoryAction(cat.id);
                      }}>
                        <button type="submit" className="text-gray-400 hover:text-red-600 p-1.5 rounded transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded" title="No se puede eliminar con endosos activos">
                        Activa
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
