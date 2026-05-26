'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function changeEndosoStatus(id: string, formData: FormData) {
  const estado = formData.get('estado') as string;
  
  await prisma.endoso.update({
    where: { id },
    data: { status: estado }
  });
  
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/endoso/${id}`);
}
