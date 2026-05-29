import { NextResponse } from 'next/server';
import { prisma, initDebug } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      where: { codigo: { not: null } }
    });
    return NextResponse.json({ success: true, count: eventos.length, initDebug });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      errorMessage: error.message,
      errorName: error.name,
      errorCode: error.code,
      errorMeta: error.meta,
      errorStack: error.stack,
      errorKeys: Object.keys(error),
      initDebug,
      rawError: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))
    }, { status: 500 });
  }
}
