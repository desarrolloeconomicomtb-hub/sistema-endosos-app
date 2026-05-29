import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

let prismaInstance: PrismaClient | undefined;

const getRealPrismaClient = (): PrismaClient => {
  if (prismaInstance) return prismaInstance;

  const env = process.env;
  const tursoUrl = env['TURSO_DATABASE_URL'];
  const tursoToken = env['TURSO_AUTH_TOKEN'];

  console.log("Lazy initializing PrismaClient. Env check:", {
    hasTursoUrl: !!tursoUrl,
    hasTursoToken: !!tursoToken,
  });

  // Ensure process.env.DATABASE_URL is set to a valid SQLite connection string at runtime.
  // Prisma requires a valid URL in the schema-defined environment variable even when a driver adapter is used.
  if (!env['DATABASE_URL'] || env['DATABASE_URL'] === 'undefined' || env['DATABASE_URL'] === '') {
    console.log("DATABASE_URL is missing or undefined. Setting fallback SQLite URL...");
    process.env['DATABASE_URL'] = 'file:./dev.db';
  }

  if (tursoUrl && tursoUrl !== "undefined" && tursoUrl !== "") {
    console.log("Initializing Prisma Client with LibSQL (Turso) Adapter...");
    const adapter = new PrismaLibSQL({
      url: tursoUrl,
      authToken: tursoToken,
    });
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
