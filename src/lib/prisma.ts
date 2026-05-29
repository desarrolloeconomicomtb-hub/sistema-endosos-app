import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

let prismaInstance: PrismaClient | undefined;

const getRealPrismaClient = (): PrismaClient => {
  if (prismaInstance) return prismaInstance;

  const env = process.env;
  const tursoUrl = env['TURSO_DATABASE_URL'];
  const tursoToken = env['TURSO_AUTH_TOKEN'];

  console.log("Lazy initializing PrismaClient. Env check:", {
    hasTursoUrl: !!tursoUrl,
    tursoUrlValue: tursoUrl,
    hasTursoToken: !!tursoToken,
  });

  if (tursoUrl && tursoUrl !== "undefined" && tursoUrl !== "") {
    console.log("Initializing Prisma Client with LibSQL (Turso) Adapter...");
    const libsql = createClient({
      url: tursoUrl,
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
