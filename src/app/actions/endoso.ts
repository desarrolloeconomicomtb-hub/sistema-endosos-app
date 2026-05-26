'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createEndoso(formData: FormData) {
  const currentYear = new Date().getFullYear();
  
  // Find the latest Endoso for the current year to determine the next sequential number
  const latestEndoso = await prisma.endoso.findFirst({
    where: {
      controlNumber: {
        endsWith: `-${currentYear}`,
      },
    },
    orderBy: {
      controlNumber: 'desc',
    },
  });

  let nextNumber = 1;
  if (latestEndoso) {
    const match = latestEndoso.controlNumber.match(/MTB-EM-(\d+)-\d+/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  // Format: MTB-EM-0001-2026
  const paddedNumber = String(nextNumber).padStart(4, '0');
  const controlNumber = `MTB-EM-${paddedNumber}-${currentYear}`;

  const endoso = await prisma.endoso.create({
    data: {
      controlNumber,
      representante: formData.get('representante') as string,
      companyName: formData.get('companyName') as string,
      representante: formData.get('representante') as string | null,
      address: formData.get('address') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      categoriaId: formData.get('categoriaId') as string,
      ubicacion: formData.get('ubicacion') as string,
      categoriaId: formData.get('categoriaId') as string,
      status: 'Pendiente',
    },
  });
  
  redirect(`/solicitar/exito?numero=${endoso.controlNumber}`);
}
