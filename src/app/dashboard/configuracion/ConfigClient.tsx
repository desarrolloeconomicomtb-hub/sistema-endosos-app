'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createEventAction, 
  deleteEventAction, 
  createCategoryAction, 
  deleteCategoryAction,
  updateEventAction,
  updateCategoryAction
} from "./actions";
import { Settings, Calendar, Tag, Trash2, Plus, AlertCircle, Loader2, Edit3, X } from "lucide-react";

interface Evento {
  id: string;
  codigo: string | null;
  nombre: string;
  fechas: string;
  ubicacion: string;
  _count: {
    endosos: number;
  };
}

interface Categoria {
  id: string;
  nombre: string;
  _count: {
    endosos: number;
  };
}

export default function ConfigClient({
  initialEventos,
  initialCategorias
}: {
  initialEventos: Evento[];
  initialCategorias: Categoria[];
}) {
  const router = useRouter();
  const [eventError, setEventError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [isEventLoading, setIsEventLoading] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryEditError, setCategoryEditError] = useState<string | null>(null);
  const [isCategoryEditLoading, setIsCategoryEditLoading] = useState(false);

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEventError(null);
    setIsEventLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createEventAction(formData);

    setIsEventLoading(false);
    if (res && res.error) {
      setEventError(res.error);
    } else {
      e.currentTarget.reset();
      router.refresh();
    }
  };

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCategoryError(null);
    setIsCategoryLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createCategoryAction(formData);

    setIsCategoryLoading(false);
    if (res && res.error) {
      setCategoryError(res.error);
    } else {
      e.currentTarget.reset();
      router.refresh();
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;
    const res = await deleteEventAction(id);
    if (res && res.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    const res = await deleteCategoryAction(id);
    if (res && res.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  };

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
            <form onSubmit={handleCreateEvent} className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200/60">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Crear Nuevo Evento</h3>
              
              {eventError && (
                <div className="flex items-center gap-2 text-xs bg-red-50 text-red-700 p-2.5 rounded border border-red-150 mb-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{eventError}</span>
                </div>
              )}

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
                disabled={isEventLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#2e5e2e] text-white py-1.5 px-4 rounded text-sm font-medium hover:bg-[#1b3d1b] transition-colors disabled:opacity-50"
              >
                {isEventLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Registrar Evento
              </button>
            </form>

            {/* Lista de Eventos */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {initialEventos.length === 0 ? (
                <p className="text-center py-6 text-sm text-gray-400">No hay eventos registrados.</p>
              ) : (
                initialEventos.map((evento) => (
                  <div key={evento.id} className="flex flex-col p-3 rounded-lg border border-gray-100 hover:bg-gray-50/50 transition-colors group">
                    {editingEventId === evento.id ? (
                      <form 
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setEditError(null);
                          setIsEditLoading(true);
                          const formData = new FormData(e.currentTarget);
                          const res = await updateEventAction(evento.id, formData);
                          setIsEditLoading(false);
                          if (res && res.error) {
                            setEditError(res.error);
                          } else {
                            setEditingEventId(null);
                            router.refresh();
                          }
                        }}
                        className="w-full space-y-2 bg-yellow-50/40 p-2 rounded border border-yellow-200"
                      >
                        <div className="flex justify-between items-center border-b border-yellow-250/20 pb-1 mb-1">
                          <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Editar Evento ({evento.codigo})</h4>
                          <button 
                            type="button" 
                            onClick={() => { setEditingEventId(null); setEditError(null); }}
                            className="text-gray-400 hover:text-gray-600 p-0.5 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        {editError && (
                          <p className="text-[10px] text-red-700 bg-red-50 p-1.5 rounded border border-red-100">{editError}</p>
                        )}

                        <div className="grid grid-cols-3 gap-1">
                          <input 
                            type="text" 
                            name="codigo" 
                            defaultValue={evento.codigo || ''} 
                            placeholder="Cod" 
                            required 
                            className="px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:border-gray-400 bg-white"
                          />
                          <input 
                            type="text" 
                            name="nombre" 
                            defaultValue={evento.nombre} 
                            placeholder="Nombre del Evento" 
                            required 
                            className="col-span-2 px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:border-gray-400 bg-white"
                          />
                        </div>
                        <input 
                          type="text" 
                          name="fechas" 
                          defaultValue={evento.fechas} 
                          placeholder="Fechas" 
                          required 
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:border-gray-400 bg-white"
                        />
                        <input 
                          type="text" 
                          name="ubicacion" 
                          defaultValue={evento.ubicacion} 
                          placeholder="Ubicación" 
                          required 
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:border-gray-400 bg-white"
                        />
                        <button 
                          type="submit" 
                          disabled={isEditLoading}
                          className="w-full flex items-center justify-center gap-1.5 bg-[#2e5e2e] text-white py-1 px-3 rounded text-xs font-semibold hover:bg-[#1b3d1b] transition-colors disabled:opacity-50"
                        >
                          {isEditLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Guardar Cambios"}
                        </button>
                      </form>
                    ) : (
                      <div className="flex justify-between items-center w-full">
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
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => { setEditingEventId(evento.id); setEditError(null); }}
                            className="text-gray-400 hover:text-green-700 p-1.5 rounded transition-colors" 
                            title="Editar Evento"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {evento._count.endosos === 0 ? (
                            <button 
                              onClick={() => handleDeleteEvent(evento.id)}
                              className="text-gray-400 hover:text-red-600 p-1.5 rounded transition-colors" 
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded" title="No se puede eliminar con endosos activos">
                              Activo
                            </span>
                          )}
                        </div>
                      </div>
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
            <form onSubmit={handleCreateCategory} className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200/60">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Crear Nueva Categoría</h3>
              
              {categoryError && (
                <div className="flex items-center gap-2 text-xs bg-red-50 text-red-700 p-2.5 rounded border border-red-150 mb-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{categoryError}</span>
                </div>
              )}

              <input 
                type="text" 
                name="nombre" 
                placeholder="Nombre de la Categoría (e.g. Comida, Bebida)" 
                required 
                className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-400 bg-white"
              />
              <button 
                type="submit"
                disabled={isCategoryLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#2e5e2e] text-white py-1.5 px-4 rounded text-sm font-medium hover:bg-[#1b3d1b] transition-colors disabled:opacity-50"
              >
                {isCategoryLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Registrar Categoría
              </button>
            </form>

            {/* Lista de Categorías */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {initialCategorias.length === 0 ? (
                <p className="text-center py-6 text-sm text-gray-400">No hay categorías registradas.</p>
              ) : (
                initialCategorias.map((cat) => (
                  <div key={cat.id} className="flex flex-col p-3 rounded-lg border border-gray-100 hover:bg-gray-50/50 transition-colors group">
                    {editingCategoryId === cat.id ? (
                      <form 
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setCategoryEditError(null);
                          setIsCategoryEditLoading(true);
                          const formData = new FormData(e.currentTarget);
                          const res = await updateCategoryAction(cat.id, formData);
                          setIsCategoryEditLoading(false);
                          if (res && res.error) {
                            setCategoryEditError(res.error);
                          } else {
                            setEditingCategoryId(null);
                            router.refresh();
                          }
                        }}
                        className="w-full space-y-2 bg-yellow-50/40 p-2 rounded border border-yellow-200"
                      >
                        <div className="flex justify-between items-center border-b border-yellow-250/20 pb-1 mb-1">
                          <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Editar Categoría</h4>
                          <button 
                            type="button" 
                            onClick={() => { setEditingCategoryId(null); setCategoryEditError(null); }}
                            className="text-gray-400 hover:text-gray-600 p-0.5 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        {categoryEditError && (
                          <p className="text-[10px] text-red-700 bg-red-50 p-1.5 rounded border border-red-100">{categoryEditError}</p>
                        )}

                        <input 
                          type="text" 
                          name="nombre" 
                          defaultValue={cat.nombre} 
                          placeholder="Nombre de Categoría" 
                          required 
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:border-gray-400 bg-white"
                        />
                        <button 
                          type="submit" 
                          disabled={isCategoryEditLoading}
                          className="w-full flex items-center justify-center gap-1.5 bg-[#2e5e2e] text-white py-1 px-3 rounded text-xs font-semibold hover:bg-[#1b3d1b] transition-colors disabled:opacity-50"
                        >
                          {isCategoryEditLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Guardar Cambios"}
                        </button>
                      </form>
                    ) : (
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">{cat.nombre}</h4>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{cat._count.endosos} Endosos</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => { setEditingCategoryId(cat.id); setCategoryEditError(null); }}
                            className="text-gray-400 hover:text-green-700 p-1.5 rounded transition-colors" 
                            title="Editar Categoría"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {cat._count.endosos === 0 ? (
                            <button 
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="text-gray-400 hover:text-red-600 p-1.5 rounded transition-colors" 
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded" title="No se puede eliminar con endosos activos">
                              Activa
                            </span>
                          )}
                        </div>
                      </div>
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
