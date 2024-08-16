import { Transaction } from '@models/transaction.model';

interface GetTransactionsParams {
  loggedInAccountId: string;
}

export async function getTransactionsService(params: GetTransactionsParams) {
  const transactions = await Transaction.find({
    $or: [
      { fromAccountId: params.loggedInAccountId },
      { toAccountId: params.loggedInAccountId },
    ],
  }).sort({ createdAt: 'desc' });

  return transactions;
}
