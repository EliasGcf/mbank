import { Account } from '@models/account.model';

interface GetAccountParams {
  loggedInAccountId: string;
  accountId: string;
}

export async function getAccountService(params: GetAccountParams) {
  const shouldReturnAmountInCents = params.loggedInAccountId === params.accountId;

  const accountPromise = Account.findById(params.accountId);

  if (shouldReturnAmountInCents) accountPromise.select('+amountInCents');

  const account = await accountPromise;

  if (!account) throw new Error('Account not found');

  return account;
}
