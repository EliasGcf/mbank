import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

import { Account } from '@models/account.model';
import { Transaction } from '@models/transaction.model';

import { createAccountService } from '@services/create-account.service';
import { getTransactionsService } from '@services/get-transactions.service';
import { transferService } from '@services/transfer.service';

describe('GetTransactionsService', () => {
  it('should be able to get a list of transactions from logged in account', async () => {
    const [senderAccount, recipientAccount] = await Promise.all([
      createAccountService({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }),
      createAccountService({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }),
    ]);

    // Deposit?
    senderAccount.amountInCents = 100_00;
    await senderAccount.save();

    await Promise.all([
      transferService({
        idempotenceKey: randomUUID(),
        loggedInAccountId: senderAccount.id,
        toAccountId: recipientAccount.id,
        amountInCents: 10_00,
      }),
      transferService({
        idempotenceKey: randomUUID(),
        loggedInAccountId: senderAccount.id,
        toAccountId: recipientAccount.id,
        amountInCents: 10_00,
      }),
      transferService({
        idempotenceKey: randomUUID(),
        loggedInAccountId: senderAccount.id,
        toAccountId: recipientAccount.id,
        amountInCents: 10_00,
      }),
    ]);

    const transactions = await getTransactionsService({
      loggedInAccountId: senderAccount.id,
    });

    expect(transactions).toHaveLength(3);
    expect(transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fromAccountId: senderAccount._id }),
        expect.objectContaining({ toAccountId: recipientAccount._id }),
      ]),
    );

    const [rawSenderAccount, rawRecipientAccount, countTransactions] = await Promise.all([
      Account.findById(senderAccount.id).select('+amountInCents'),
      Account.findById(recipientAccount.id).select('+amountInCents'),
      Transaction.countDocuments({
        $or: [{ fromAccountId: senderAccount.id }, { toAccountId: senderAccount.id }],
      }),
    ]);

    expect(rawSenderAccount?.amountInCents).toBe(70_00);
    expect(rawRecipientAccount?.amountInCents).toBe(30_00);
    expect(countTransactions).toBe(3);
  });
});
