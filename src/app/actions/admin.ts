'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function changeEndosoStatus(id: string, formData: FormData) {
  const status = formData.get('status') as string;
  
  await prisma.endoso.update({
    where: { id },
    data: { status: status }
  });
  
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/endoso/${id}`);
}
