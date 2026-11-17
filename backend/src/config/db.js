import { PrismaClient } from '@prisma/client';
import { withManagedTiDBTls } from './databaseUrl.js';

let prisma;

export function getDb() {
  if (!process.env.DATABASE_URL) return null;
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: { db: { url: withManagedTiDBTls(process.env.DATABASE_URL) } },
    });
  }
  return prisma;
}

export async function checkDatabase() {
  const client = getDb();
  if (!client) return false;
  try {
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function disconnectDatabase() {
  if (prisma) await prisma.$disconnect();
}
