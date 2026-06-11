'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteEndoso(id: string) {
  try {
    await prisma.endoso.delete({
      where: { id }
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error("Error al eliminar el endoso:", error);
    return { success: false, error: error.message || "Error al eliminar el endoso." };
  }
}
