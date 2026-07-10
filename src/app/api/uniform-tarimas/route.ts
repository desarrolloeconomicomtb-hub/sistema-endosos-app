import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function normalizeTarima(val: string | null): string | null {
  if (!val) return null;
  let s = val.trim().toLowerCase();
  
  // Clean values that mean empty
  if (s === '' || s === '-' || s === 'n/a' || s === 'ninguna' || s === 'sin tarima' || s === 'null' || s === 'undefined') {
    return null;
  }

  // Remove multiple spaces
  s = s.replace(/\s+/g, ' ');

  // Standardize Tarima Principal
  if (s.includes('principal') || s === 'pr' || s === 'princ') {
    return 'Tarima Principal';
  }

  // Standardize Tarima Boquerón
  if (s.includes('boqueron') || s.includes('boquerón')) {
    return 'Tarima Boquerón';
  }

  // Standardize Tarima Sur
  if (s.includes('sur')) {
    return 'Tarima Sur';
  }

  // Standardize Tarima Norte
  if (s.includes('norte')) {
    return 'Tarima Norte';
  }

  // Standardize Tarima Oeste
  if (s.includes('oeste')) {
    return 'Tarima Oeste';
  }

  // Standardize Tarima Este
  if (s.includes('este')) {
    return 'Tarima Este';
  }

  // Standardize Tarima 1, 2, 3, etc.
  const numMatch = s.match(/(?:tarima\s+)?(\d+)/);
  if (numMatch) {
    return `Tarima ${numMatch[1]}`;
  }

  // Capitalize first letter of each word as fallback
  return val.trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export async function GET() {
  try {
    // Get all endosos
    const endosos = await prisma.endoso.findMany({
      select: {
        id: true,
        tarima: true,
        companyName: true
      }
    });

    const report: { id: string; companyName: string; original: string | null; normalized: string | null; status: string }[] = [];
    let updatedCount = 0;

    for (const endoso of endosos) {
      const original = endoso.tarima;
      const normalized = normalizeTarima(original);

      if (original !== normalized) {
        // Update database
        await prisma.endoso.update({
          where: { id: endoso.id },
          data: { tarima: normalized }
        });

        report.push({
          id: endoso.id,
          companyName: endoso.companyName,
          original,
          normalized,
          status: 'UPDATED'
        });
        updatedCount++;
      } else {
        if (original !== null) {
          report.push({
            id: endoso.id,
            companyName: endoso.companyName,
            original,
            normalized,
            status: 'NO_CHANGE'
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Standardization completed. Updated ${updatedCount} records.`,
      updatedCount,
      totalRecordsAnalyzed: endosos.length,
      details: report
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}
