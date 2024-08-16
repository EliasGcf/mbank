import { Account } from '@models/account.model';
import { Transaction } from '@models/transaction.model';

import { transactionWithReturn } from '../utils/transaction-with-return';

interface TransferParams {
  idempotenceKey: string;
  loggedInAccountId: string;
  toAccountId: string;
  amountInCents: number;
  description?: string;
}

export async function transferService(params: TransferParams) {
  const fromAccount = await Account.findById(params.loggedInAccountId).select(
    '+amountInCents',
  );

  if (!fromAccount) throw new Error('From Account not found');

  const hasEnoughFunds = fromAccount.amountInCents >= params.amountInCents;

  if (!hasEnoughFunds) throw new Error('Insufficient funds');

  const toAccount = await Account.findById(params.toAccountId);

  if (!toAccount) throw new Error('To Account not found');

  if (fromAccount.id === toAccount.id) {
    throw new Error('It is not possible to transfer to the same account');
  }

  const transactionFromIdempotenceKey = await Transaction.findOne({
    idempotenceKey: params.idempotenceKey,
    fromAccountId: params.loggedInAccountId,
    toAccountId: params.toAccountId,
  });

  if (transactionFromIdempotenceKey) {
    return {
      account: fromAccount,
      transaction: transactionFromIdempotenceKey,
    };
  }

  const [updatedFromAccount, transaction] = await transactionWithReturn(
    async (session) => {
      const updatedFromAccount = await Account.findByIdAndUpdate(
        fromAccount._id,
        { $inc: { amountInCents: -params.amountInCents } },
        { new: true, session },
      ).select('+amountInCents');

      if (!updatedFromAccount) throw new Error('From Account not found');

      await Account.findByIdAndUpdate(
        toAccount._id,
        { $inc: { amountInCents: params.amountInCents } },
        { session },
      );

      const transaction = new Transaction({
        fromAccountId: fromAccount._id,
        toAccountId: toAccount._id,
        amountInCents: params.amountInCents,
        description: params.description,
        idempotenceKey: params.idempotenceKey,
      });

      await transaction.save({ session });

      return [updatedFromAccount, transaction];
    },
  );

  return { account: updatedFromAccount, transaction };
}
