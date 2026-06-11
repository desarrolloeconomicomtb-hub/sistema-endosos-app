'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteEndoso } from '@/app/actions/delete';

export default function DeleteEndosoButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Click en eliminar para el endoso:', id);
    if (!window.confirm('¿Estás seguro de que deseas eliminar permanentemente este endoso?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteEndoso(id);
      if (result && !result.success) {
        alert(result.error || 'Ocurrió un error al intentar eliminar el endoso.');
      } else {
        router.refresh();
      }
    } catch (e: any) {
      console.error(e);
      alert('Error de conexión o del servidor al eliminar.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      type="button"
      onClick={(e) => {
        alert('¡El click de React funciona!');
        handleDelete(e);
      }}
      disabled={isDeleting}
      className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50" 
      title="Eliminar"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
