import { prisma } from '@lib/prisma';

interface GetTransactionsParams {
  loggedInAccountId: string;
}

export async function getTransactionsService(params: GetTransactionsParams) {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      OR: [
        { fromAccountId: params.loggedInAccountId },
        { toAccountId: params.loggedInAccountId },
      ],
    },
  });

  return transactions;
}
