import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envKeys = Object.keys(process.env);
  
  const diagnostics = {
    currentTime: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    envKeysPresent: envKeys,
    tursoUrl: {
      exists: !!process.env.TURSO_DATABASE_URL,
      type: typeof process.env.TURSO_DATABASE_URL,
      length: process.env.TURSO_DATABASE_URL ? process.env.TURSO_DATABASE_URL.length : 0,
      valueIsUndefinedString: process.env.TURSO_DATABASE_URL === 'undefined',
      valueIsEmptyString: process.env.TURSO_DATABASE_URL === '',
      previewValue: process.env.TURSO_DATABASE_URL 
        ? `${process.env.TURSO_DATABASE_URL.substring(0, 10)}...` 
        : null
    },
    tursoToken: {
      exists: !!process.env.TURSO_AUTH_TOKEN,
      type: typeof process.env.TURSO_AUTH_TOKEN,
      length: process.env.TURSO_AUTH_TOKEN ? process.env.TURSO_AUTH_TOKEN.length : 0,
      valueIsUndefinedString: process.env.TURSO_AUTH_TOKEN === 'undefined',
    },
    databaseUrl: {
      exists: !!process.env.DATABASE_URL,
      type: typeof process.env.DATABASE_URL,
      length: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
      valueIsUndefinedString: process.env.DATABASE_URL === 'undefined',
      previewValue: process.env.DATABASE_URL 
        ? `${process.env.DATABASE_URL.substring(0, 10)}...` 
        : null
    }
  };

  return NextResponse.json(diagnostics);
}
