import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getPrismaClient = () => {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  const dbUrl = process.env.DATABASE_URL;

  console.log("getPrismaClient initialized. Env check:", {
    hasTursoUrl: !!tursoUrl,
    tursoUrlValueType: typeof tursoUrl,
    tursoUrlLength: tursoUrl ? tursoUrl.length : 0,
    isTursoUrlStringUndefined: tursoUrl === "undefined",
    hasTursoToken: !!tursoToken,
    hasDbUrl: !!dbUrl,
    dbUrlLength: dbUrl ? dbUrl.length : 0,
    isDbUrlStringUndefined: dbUrl === "undefined",
  });

  if (tursoUrl && tursoUrl !== "undefined" && tursoUrl !== "" && tursoToken && tursoToken !== "undefined" && tursoToken !== "") {
    console.log("Using Prisma adapter for LibSQL (Turso)...");
    const libsql = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });
    const adapter = new PrismaLibSql(libsql);
    return new PrismaClient({ adapter });
  }

  console.log("Falling back to standard PrismaClient...");
  return new PrismaClient();
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
