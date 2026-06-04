'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createEventAction(formData: FormData) {
  const codigo = formData.get("codigo") as string;
  const nombre = formData.get("nombre") as string;
  const fechas = formData.get("fechas") as string;
  const ubicacion = formData.get("ubicacion") as string;

  if (!codigo || !nombre || !fechas || !ubicacion) return { error: "Todos los campos son requeridos." };

  try {
    await prisma.evento.create({
      data: { codigo, nombre, fechas, ubicacion }
    });
    revalidatePath("/dashboard/configuracion");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Error al crear el evento." };
  }
}

export async function deleteEventAction(id: string) {
  try {
    await prisma.evento.delete({ where: { id } });
    revalidatePath("/dashboard/configuracion");
    return { success: true };
  } catch (err: any) {
    return { error: "No se puede eliminar el evento porque tiene endosos asociados." };
  }
}

export async function updateEventAction(id: string, formData: FormData) {
  const codigo = formData.get("codigo") as string;
  const nombre = formData.get("nombre") as string;
  const fechas = formData.get("fechas") as string;
  const ubicacion = formData.get("ubicacion") as string;

  if (!id || !codigo || !nombre || !fechas || !ubicacion) return { error: "Todos los campos son requeridos." };

  try {
    await prisma.evento.update({
      where: { id },
      data: { codigo, nombre, fechas, ubicacion }
    });
    await prisma.endoso.updateMany({
      where: { eventoId: id },
      data: { fechasEvento: fechas, ubicacion: ubicacion }
    });
    revalidatePath("/dashboard/configuracion");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Error al actualizar el evento." };
  }
}

export async function createCategoryAction(formData: FormData) {
  const nombre = formData.get("nombre") as string;

  if (!nombre) return { error: "El nombre es requerido." };

  try {
    await prisma.categoria.create({
      data: { nombre }
    });
    revalidatePath("/dashboard/configuracion");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Error al crear la categoría." };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await prisma.categoria.delete({ where: { id } });
    revalidatePath("/dashboard/configuracion");
    return { success: true };
  } catch (err: any) {
    return { error: "No se puede eliminar la categoría porque tiene endosos asociados." };
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const nombre = formData.get("nombre") as string;

  if (!id || !nombre) return { error: "El nombre es requerido." };

  try {
    await prisma.categoria.update({
      where: { id },
      data: { nombre }
    });
    revalidatePath("/dashboard/configuracion");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Error al actualizar la categoría." };
  }
}
