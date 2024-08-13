import { prisma } from '@lib/prisma';

interface GetAccountParams {
  loggedInAccountId: string;
  accountId: string;
}

export async function getAccountService(params: GetAccountParams) {
  const shouldReturnAmountInCents = params.loggedInAccountId === params.accountId;

  const account = await prisma.account.findUnique({
    where: { id: params.accountId },
    omit: { amountInCents: !shouldReturnAmountInCents },
  });

  if (!account) throw new Error('Account not found');

  return {
    ...account,
    amountInCents: shouldReturnAmountInCents ? account.amountInCents : null,
  };
}
