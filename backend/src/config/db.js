import { createRequire } from 'node:module';
import { randomBytes } from 'node:crypto';
import { withManagedTiDBTls } from './databaseUrl.js';

const require = createRequire(import.meta.url);

let prisma;
let usingMock = false;

function createMockDb() {
  const users = new Map();
  const usersByEmail = new Map();
  const sessions = new Map();
  const scans = [];
  const preferences = [];

  const mockId = (prefix = 'mock') => `${prefix}_${randomBytes(8).toString('hex')}`;

  const client = {
    user: {
      async create({ data }) {
        if (usersByEmail.has(data.email)) {
          const err = new Error('Unique constraint failed on the fields: (`email`)');
          err.code = 'P2002';
          throw err;
        }
        const record = {
          id: mockId('usr'),
          name: data.name,
          email: data.email,
          password: data.password,
          createdAt: new Date(),
        };
        users.set(record.id, record);
        usersByEmail.set(record.email, record);
        return { ...record };
      },
      async findUnique({ where }) {
        if (where?.id) {
          const user = users.get(where.id);
          return user ? { ...user } : null;
        }
        if (where?.email) {
          const user = usersByEmail.get(where.email);
          return user ? { ...user } : null;
        }
        return null;
      },
    },
    session: {
      async create({ data }) {
        const record = {
          id: mockId('ses'),
          userId: data.userId,
          tokenHash: data.tokenHash,
          expiresAt: data.expiresAt instanceof Date ? data.expiresAt : new Date(data.expiresAt),
          createdAt: new Date(),
        };
        sessions.set(record.tokenHash, record);
        return { ...record };
      },
      async findUnique({ where }) {
        const session = where?.tokenHash ? sessions.get(where.tokenHash) : null;
        if (!session) return null;
        const user = users.get(session.userId) || null;
        return {
          ...session,
          user: user ? { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt } : null,
        };
      },
      async deleteMany({ where }) {
        let count = 0;
        if (where?.tokenHash && sessions.delete(where.tokenHash)) count += 1;
        return { count };
      },
    },
    scanHistory: {
      async create({ data }) {
        const record = {
          id: mockId('scn'),
          userId: data.userId,
          originalImageUrl: data.originalImageUrl ?? null,
          transformedImageUrl: data.transformedImageUrl ?? null,
          cvdType: data.cvdType,
          createdAt: new Date(),
        };
        scans.unshift(record);
        return { ...record };
      },
      async findMany({ where, take = 20 } = {}) {
        const filtered = where?.userId
          ? scans.filter((item) => item.userId === where.userId)
          : scans;
        return filtered.slice(0, take).map((item) => ({
          id: item.id,
          cvdType: item.cvdType,
          originalImageUrl: item.originalImageUrl,
          transformedImageUrl: item.transformedImageUrl,
          createdAt: item.createdAt,
        }));
      },
    },
    cvdPreference: {
      async create({ data }) {
        const record = {
          id: mockId('prf'),
          userId: data.userId,
          cvdType: data.cvdType,
          preferredPalette: data.preferredPalette ?? null,
          createdAt: new Date(),
        };
        preferences.push(record);
        return { ...record };
      },
    },
    async $transaction(fn) {
      return fn(client);
    },
    async $queryRaw() {
      return [{ 1: 1 }];
    },
    async $disconnect() {},
  };

  return client;
}

export function getDb() {
  if (prisma) return prisma;
  if (!process.env.DATABASE_URL) {
    if (!usingMock) {
      console.warn('[AI Studio] DATABASE_URL not configured — using in-memory database mock');
      usingMock = true;
    }
    prisma = createMockDb();
    return prisma;
  }
  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient({
      datasources: { db: { url: withManagedTiDBTls(process.env.DATABASE_URL) } },
    });
  } catch (error) {
    console.warn(`[AI Studio] Database not connected (${error?.message || 'init failed'}) — using in-memory mock`);
    usingMock = true;
    prisma = createMockDb();
  }
  return prisma;
}

export async function checkDatabase() {
  const client = getDb();
  if (!client) return false;
  try {
    await client.$queryRaw`SELECT 1`;
    return !usingMock;
  } catch {
    return false;
  }
}

export async function disconnectDatabase() {
  if (prisma && !usingMock) await prisma.$disconnect();
}
