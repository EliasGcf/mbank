import 'dotenv/config';

import { randomUUID } from 'node:crypto';

import mongoose from 'mongoose';
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

    const db = await mongoose.connect(databaseURL);

    return {
      async teardown() {
        await db.connection.db?.dropDatabase();
        await db.connection.close();
      },
    };
  },
} as Environment;
