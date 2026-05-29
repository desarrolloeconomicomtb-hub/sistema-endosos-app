import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

let prismaInstance: PrismaClient | undefined;

const getRealPrismaClient = (): PrismaClient => {
  if (prismaInstance) return prismaInstance;

  // Use bracket notation to prevent Next.js/Webpack from inlining these variables at build time
  const env = process.env;
  const tursoUrl = env['TURSO_DATABASE_URL'];
  const tursoToken = env['TURSO_AUTH_TOKEN'];

  console.log("Lazy initializing PrismaClient. Env check:", {
    hasTursoUrl: !!tursoUrl,
    hasTursoToken: !!tursoToken,
    nodeEnv: env['NODE_ENV'],
    isVercel: !!env['VERCEL']
  });

  // If we have Turso credentials, or if we are on Vercel (where we must use Turso)
  if ((tursoUrl && tursoUrl !== "undefined" && tursoUrl !== "") || env['VERCEL']) {
    console.log("Initializing Prisma Client with LibSQL (Turso) Adapter...");
    const libsql = createClient({
      url: tursoUrl || "libsql://dummy-url.turso.io", // fallback dummy url to prevent constructor throw
      authToken: tursoToken,
    });
    const adapter = new PrismaLibSql(libsql);
    prismaInstance = new PrismaClient({ adapter });
  } else {
    console.log("Initializing standard Prisma Client (Local SQLite)...");
    prismaInstance = new PrismaClient();
  }

  return prismaInstance;
};

// Export a Proxy that forwards all operations to the dynamically resolved PrismaClient
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const client = getRealPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});
