import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? 'file:./dev.db';

  if (url.startsWith('libsql://')) {
    // Turso production path — requires @prisma/adapter-libsql + @libsql/client (installed).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require('@prisma/adapter-libsql') as typeof import('@prisma/adapter-libsql');
    const factory = new PrismaLibSql({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    // Prisma 5 driver adapter factory — cast needed until Prisma 6 upgrade.
    return new PrismaClient({ adapter: factory as never });
  }

  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
