import { Account } from '@models/account.model';
import { Transaction } from '@models/transaction.model';

interface GetTransactionParams {
  loggedInAccountId: string;
  transactionId: string;
}

export async function getTransactionService(params: GetTransactionParams) {
  const account = await Account.findById(params.loggedInAccountId);

  if (!account) throw new Error('Account not found');

  const transaction = await Transaction.findById(params.transactionId);

  if (!transaction) throw new Error('Transaction not found');

  return transaction;
}
