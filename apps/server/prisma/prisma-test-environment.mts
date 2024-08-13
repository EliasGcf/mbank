import 'dotenv/config';

import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

import { PrismaClient } from '@prisma/client';
import { Environment } from 'vitest/environments';

function generateDatabaseURL(id: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.pathname = `/${id}`;

  return url.toString();
}

export default {
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const id = randomUUID();
    const databaseURL = generateDatabaseURL(id);

    process.env.DATABASE_URL = databaseURL;

    execSync('npx prisma db push');

    return {
      async teardown() {
        const prisma = new PrismaClient();

        await prisma.$runCommandRaw({ dropDatabase: 1 });

        await prisma.$disconnect();
      },
    };
  },
} as Environment;
