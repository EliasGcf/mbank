import { prisma } from '@lib/prisma';

interface TransferParams {
  idempotenceKey: string;
  loggedInAccountId: string;
  toAccountId: string;
  amountInCents: number;
  description?: string;
}

export async function transferService(params: TransferParams) {
  const fromAccount = await prisma.account.findUnique({
    where: { id: params.loggedInAccountId },
    omit: { amountInCents: false },
  });

  if (!fromAccount) throw new Error('From Account not found');

  const hasEnoughFunds = fromAccount.amountInCents >= params.amountInCents;

  if (!hasEnoughFunds) throw new Error('Insufficient funds');

  const toAccount = await prisma.account.findUnique({
    where: { id: params.toAccountId },
  });

  if (!toAccount) throw new Error('To Account not found');

  if (fromAccount.id === toAccount.id) {
    throw new Error('It is not possible to transfer to the same account');
  }

  const transactionFromIdempotenceKey = await prisma.transaction.findUnique({
    where: {
      idempotenceKey_fromAccountId_toAccountId: {
        idempotenceKey: params.idempotenceKey,
        fromAccountId: params.loggedInAccountId,
        toAccountId: params.toAccountId,
      },
    },
  });

  if (transactionFromIdempotenceKey) {
    return {
      account: fromAccount,
      transaction: transactionFromIdempotenceKey,
    };
  }

  const [updatedFromAccount, , transaction] = await prisma.$transaction([
    prisma.account.update({
      where: { id: fromAccount.id },
      data: { amountInCents: { decrement: params.amountInCents } },
      omit: { amountInCents: false },
    }),
    prisma.account.update({
      where: { id: toAccount.id },
      data: { amountInCents: { increment: params.amountInCents } },
    }),
    prisma.transaction.create({
      data: {
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amountInCents: params.amountInCents,
        description: params.description,
        idempotenceKey: params.idempotenceKey,
      },
    }),
  ]);

  return { account: updatedFromAccount, transaction };
}
