'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function changeEndosoStatus(id: string, formData: FormData) {
  const estado = formData.get('estado') as string;
  
  await prisma.endoso.update({
    where: { id },
    data: { estado }
  });
  
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/endoso/${id}`);
}

export async function updateFirmante(id: string, formData: FormData) {
  const firmante_nombre = formData.get('firmante_nombre') as string;
  const firmante_puesto = formData.get('firmante_puesto') as string;
  
  await prisma.endoso.update({
    where: { id },
    data: { 
      firmante_nombre: firmante_nombre || null,
      firmante_puesto: firmante_puesto || null
    }
  });
  
  revalidatePath(`/dashboard/endoso/${id}`);
  revalidatePath(`/dashboard/endoso/${id}/carta`);
}
