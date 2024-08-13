import { prisma } from '@lib/prisma';

interface GetTransactionParams {
  loggedInAccountId: string;
  transactionId: string;
}

export async function getTransactionService(params: GetTransactionParams) {
  const account = await prisma.account.findUnique({
    where: { id: params.loggedInAccountId },
    select: {
      id: true,
      receivedTransactions: {
        where: { id: params.transactionId },
      },
      sendedTransactions: {
        where: { id: params.transactionId },
      },
    },
  });

  if (!account) throw new Error('Account not found');

  const transaction = account.receivedTransactions[0] || account.sendedTransactions[0];

  if (!transaction) throw new Error('Transaction not found');

  return transaction;
}
