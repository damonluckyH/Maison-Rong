import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const url = process.env.DATABASE_URL ?? 'file:./dev.db';

  if (url.startsWith('libsql://')) {
    const libsql = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql);
    globalForPrisma.prisma = new PrismaClient({ adapter: adapter as any });
    return globalForPrisma.prisma;
  }

  globalForPrisma.prisma = new PrismaClient();
  return globalForPrisma.prisma;
}

export const prisma = getPrismaClient();
