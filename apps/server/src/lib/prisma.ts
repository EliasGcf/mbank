import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  omit: {
    account: {
      password: true,
      amountInCents: true,
    },
  },
});
