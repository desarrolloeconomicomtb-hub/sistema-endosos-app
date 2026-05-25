'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createEndoso(formData: FormData) {
  const currentYear = new Date().getFullYear();
  
  // Find the latest Endoso for the current year to determine the next sequential number
  const latestEndoso = await prisma.endoso.findFirst({
    where: {
      numero_control: {
        endsWith: `-${currentYear}`,
      },
    },
    orderBy: {
      numero_control: 'desc',
    },
  });

  let nextNumber = 1;
  if (latestEndoso) {
    const match = latestEndoso.numero_control.match(/MTB-EM-(\d+)-\d+/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  // Format: MTB-EM-0001-2026
  const paddedNumber = String(nextNumber).padStart(4, '0');
  const numero_control = `MTB-EM-${paddedNumber}-${currentYear}`;

  const endoso = await prisma.endoso.create({
    data: {
      numero_control,
      titulo: formData.get('titulo') as string,
      nombre: formData.get('nombre') as string,
      apellidos: formData.get('apellidos') as string | null,
      direccion: formData.get('direccion') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      actividad: formData.get('actividad') as string,
      ubicacion: formData.get('ubicacion') as string,
      tipo_venta: formData.get('tipo_venta') as string,
      estado: 'Pendiente',
    },
  });
  
  redirect(`/solicitar/exito?numero=${endoso.numero_control}`);
}
