import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (!tursoUrl || !tursoToken) {
    return NextResponse.json({
      success: false,
      message: "Env vars missing",
      hasUrl: !!tursoUrl,
      hasToken: !!tursoToken
    }, { status: 400 });
  }

  try {
    const client = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });

    const result = await client.execute("SELECT 1 as val;");
    return NextResponse.json({
      success: true,
      message: "Successfully connected to LibSQL/Turso directly!",
      rows: result.rows
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Failed to connect to LibSQL/Turso directly",
      errorMessage: error.message,
      errorName: error.name,
      errorStack: error.stack,
    }, { status: 500 });
  }
}
