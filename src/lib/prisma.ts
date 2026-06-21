import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createTursoClient(url: string): PrismaClient {
  const { PrismaLibSQL } = require('@prisma/adapter-libsql');
  const { createClient } = require('@libsql/client');
  const libsql = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  const adapter = new PrismaLibSQL(libsql);
  return new PrismaClient({ adapter: adapter as any });
}

function createPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const url = process.env.DATABASE_URL ?? 'file:./dev.db';
  if (url.startsWith('libsql://')) {
    return createTursoClient(url);
  }

  return new PrismaClient();
}

export const prisma = createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
