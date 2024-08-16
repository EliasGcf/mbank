import { Account } from '@models/account.model';

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
    const account = await Account.findById(params.loggedInAccountId).select(
      '+amountInCents',
    );

    if (!account) throw new Error('Account not found');

    return account;
  }

  const account = await Account.findOne({ email: params.email });

  if (!account) throw new Error('Account not found');

  return account;
}
