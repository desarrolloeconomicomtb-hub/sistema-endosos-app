'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function getNextSequence(eventoCode: string) {
  const count = await prisma.endoso.count({
    where: {
      controlNumber: {
        startsWith: `${eventoCode}-`
      }
    }
  });
  return count + 1;
}

export async function createEndoso(formData: FormData) {
  let success = false;
  let errorMsg = '';
  try {
    const companyName = formData.get('companyName') as string;
    const representante = formData.get('representante') as string;
    const telefono = formData.get('telefono') as string;
    const email = formData.get('email') as string;
    const descripcion = formData.get('descripcion') as string;
    
    const issueDatesEvento = formData.get('issueDatesEvento') as string;
    const ubicacion = formData.get('ubicacion') as string;
    const tarima = formData.get('tarima') as string | null;

    const eventoCode = formData.get('eventoCode') as string;
    const tipoCode = formData.get('tipoCode') as string;

    let evento = await prisma.evento.findUnique({ where: { codigo: eventoCode } });
    if (!evento) {
      evento = await prisma.evento.create({
        data: { codigo: eventoCode, nombre: `Evento ${eventoCode}`, fechas: issueDatesEvento, ubicacion: ubicacion }
      });
    }
    
    let finalCategoriaId = formData.get('categoriaId') as string;
    if (!finalCategoriaId) {
      let categoriaNombre = '';
      switch(tipoCode) {
        case 'CO': categoriaNombre = 'Comida'; break;
        case 'BE': categoriaNombre = 'Bebida'; break;
        case 'AR': categoriaNombre = 'Artesanías'; break;
        case 'PS': categoriaNombre = 'Productos y/o Servicios'; break;
        case 'PICA': categoriaNombre = 'Pica'; break;
        case 'MISC': categoriaNombre = 'Misceláneos'; break;
        default: categoriaNombre = tipoCode; break;
      }
      
      let categoria = await prisma.categoria.findFirst({ where: { nombre: { contains: categoriaNombre.substring(0, 4) } } });
      if (!categoria) {
        categoria = await prisma.categoria.create({
          data: { nombre: categoriaNombre }
        });
      }
      finalCategoriaId = categoria.id;
    }

    // Generate control number securely on the server
    const nextSeq = await getNextSequence(eventoCode);
    const year = new Date().getFullYear();
    const controlNumber = `${eventoCode}-MTB-${tipoCode}-${nextSeq.toString().padStart(3, '0')}-${year}`;

    const reciboPatente = formData.get('reciboPatente') as string | null;
    const reciboPatenteUrl = formData.get('reciboPatenteUrl') as string | null;
    const reciboAmbulante = formData.get('reciboAmbulante') as string | null;
    const reciboAmbulanteUrl = formData.get('reciboAmbulanteUrl') as string | null;
    const reciboBebidas = formData.get('reciboBebidas') as string | null;
    const reciboBebidasUrl = formData.get('reciboBebidasUrl') as string | null;
    
    const exentoPago = formData.get('exentoPago') === 'on';
    const exentoRazon = formData.get('exentoRazon') as string | null;

    const firmanteNombre = formData.get('firmanteNombre') as string || undefined;
    const firmantePuesto = formData.get('firmantePuesto') as string || undefined;
    const firmanteExtension = formData.get('firmanteExtension') as string || undefined;
    const firmanteEmail = formData.get('firmanteEmail') as string || undefined;

    await prisma.endoso.create({
      data: {
        controlNumber,
        companyName,
        representante,
        telefono,
        email,
        descripcion,
        fechasEvento: issueDatesEvento,
        ubicacion,
        tarima: tarima || null,
        eventoId: evento.id,
        categoriaId: finalCategoriaId,
        reciboPatente: exentoPago ? null : (reciboPatente || null),
        reciboPatenteUrl: exentoPago ? null : (reciboPatenteUrl || null),
        reciboAmbulante: exentoPago ? null : (reciboAmbulante || null),
        reciboAmbulanteUrl: exentoPago ? null : (reciboAmbulanteUrl || null),
        reciboBebidas: exentoPago ? null : (reciboBebidas || null),
        reciboBebidasUrl: exentoPago ? null : (reciboBebidasUrl || null),
        exentoPago,
        exentoRazon: exentoPago ? exentoRazon : null,
        firmanteNombre,
        firmantePuesto,
        firmanteExtension,
        firmanteEmail,
      }
    });
    success = true;
  } catch (error: any) {
    console.error("Error al crear endoso:", error);
    errorMsg = error.message || "Error desconocido";
  }

  if (success) {
    revalidatePath('/dashboard');
    redirect('/dashboard');
  } else {
    redirect(`/dashboard/endosos/nuevo?error=${encodeURIComponent(errorMsg)}`);
  }
}

export async function updateEndoso(id: string, formData: FormData) {
  let success = false;
  let errorMsg = '';
  try {
    const companyName = formData.get('companyName') as string;
    const representante = formData.get('representante') as string;
    const telefono = formData.get('telefono') as string;
    const email = formData.get('email') as string;
    const descripcion = formData.get('descripcion') as string;
    
    const issueDatesEvento = formData.get('issueDatesEvento') as string;
    const ubicacion = formData.get('ubicacion') as string;
    const tarima = formData.get('tarima') as string | null;

    const reciboPatente = formData.get('reciboPatente') as string | null;
    const reciboPatenteUrl = formData.get('reciboPatenteUrl') as string | null;
    const reciboAmbulante = formData.get('reciboAmbulante') as string | null;
    const reciboAmbulanteUrl = formData.get('reciboAmbulanteUrl') as string | null;
    const reciboBebidas = formData.get('reciboBebidas') as string | null;
    const reciboBebidasUrl = formData.get('reciboBebidasUrl') as string | null;
    
    const exentoPago = formData.get('exentoPago') === 'on';
    const exentoRazon = formData.get('exentoRazon') as string | null;

    const tipoCode = formData.get('tipoCode') as string;
    let categoriaId = formData.get('categoriaId') as string | undefined;

    if (!categoriaId && tipoCode) {
      let categoriaNombre = '';
      switch(tipoCode) {
        case 'CO': categoriaNombre = 'Comida'; break;
        case 'BE': categoriaNombre = 'Bebida'; break;
        case 'AR': categoriaNombre = 'Artesanías'; break;
        case 'PS': categoriaNombre = 'Productos y/o Servicios'; break;
        case 'PICA': categoriaNombre = 'Pica'; break;
        case 'MISC': categoriaNombre = 'Misceláneos'; break;
        default: categoriaNombre = tipoCode; break;
      }
      
      let categoria = await prisma.categoria.findFirst({ where: { nombre: { contains: categoriaNombre.substring(0, 4) } } });
      if (!categoria) {
        categoria = await prisma.categoria.create({
          data: { nombre: categoriaNombre }
        });
      }
      categoriaId = categoria.id;
    }

    const firmanteNombre = formData.get('firmanteNombre') as string || undefined;
    const firmantePuesto = formData.get('firmantePuesto') as string || undefined;
    const firmanteExtension = formData.get('firmanteExtension') as string || undefined;
    const firmanteEmail = formData.get('firmanteEmail') as string || undefined;

    const controlNumber = formData.get('controlNumber') as string;
    const eventoCode = formData.get('eventoCode') as string;
    let eventoId: string | undefined = undefined;

    if (eventoCode) {
      let evento = await prisma.evento.findUnique({ where: { codigo: eventoCode } });
      if (!evento) {
        evento = await prisma.evento.create({
          data: { codigo: eventoCode, nombre: `Evento ${eventoCode}`, fechas: issueDatesEvento, ubicacion: ubicacion }
        });
      } else {
        await prisma.evento.update({
          where: { id: evento.id },
          data: { fechas: issueDatesEvento, ubicacion: ubicacion }
        });
      }
      eventoId = evento.id;
    }

    await prisma.endoso.update({
      where: { id },
      data: {
        controlNumber: controlNumber || undefined,
        companyName,
        representante,
        telefono,
        email,
        descripcion,
        fechasEvento: issueDatesEvento,
        ubicacion,
        tarima: tarima || null,
        eventoId: eventoId || undefined,
        categoriaId: categoriaId || undefined,
        reciboPatente: exentoPago ? null : (reciboPatente || null),
        reciboPatenteUrl: exentoPago ? null : (reciboPatenteUrl || null),
        reciboAmbulante: exentoPago ? null : (reciboAmbulante || null),
        reciboAmbulanteUrl: exentoPago ? null : (reciboAmbulanteUrl || null),
        reciboBebidas: exentoPago ? null : (reciboBebidas || null),
        reciboBebidasUrl: exentoPago ? null : (reciboBebidasUrl || null),
        exentoPago,
        exentoRazon: exentoPago ? exentoRazon : null,
        firmanteNombre,
        firmantePuesto,
        firmanteExtension,
        firmanteEmail,
      }
    });
    success = true;
  } catch (error: any) {
    console.error("Error al actualizar endoso:", error);
    errorMsg = error.message || "Error desconocido";
  }

  if (success) {
    revalidatePath('/dashboard');
    redirect('/dashboard');
  } else {
    redirect(`/dashboard/endosos/${id}/editar?error=${encodeURIComponent(errorMsg)}`);
  }
}


export async function registrarVisita(formData: FormData) {
  const id = formData.get('id') as string;
  const controlNumber = formData.get('controlNumber') as string;
  
  await prisma.endoso.update({
    where: { id },
    data: { visitedAt: new Date() }
  });
  
  revalidatePath(`/verificar/${encodeURIComponent(controlNumber)}`);
}

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

