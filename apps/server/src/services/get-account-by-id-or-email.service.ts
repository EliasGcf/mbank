import { prisma } from '@lib/prisma';

interface GetAccountParams {
  loggedInAccountId: string;
  email?: string;
}

interface Result {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  amountInCents?: number | null;
}

export async function getAccountByIdOrEmailService(
  params: GetAccountParams,
): Promise<Result> {
  if (!params.email) {
    const account = await prisma.account.findUnique({
      where: { id: params.loggedInAccountId },
      omit: { amountInCents: false },
    });

    if (!account) throw new Error('Account not found');

    return account;
  }

  const account = await prisma.account.findUnique({
    where: { email: params.email },
  });

  if (!account) throw new Error('Account not found');

  return account;
}
