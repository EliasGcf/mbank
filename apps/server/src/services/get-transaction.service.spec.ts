import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

import { createAccountService } from '@services/create-account.service';
import { getTransactionService } from '@services/get-transaction.service';
import { transferService } from '@services/transfer.service';

describe('GetTransactionService', () => {
  it('should be able to get a transaction', async () => {
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

    const transfer = await transferService({
      idempotenceKey: randomUUID(),
      loggedInAccountId: senderAccount.id,
      toAccountId: recipientAccount.id,
      amountInCents: 10_00,
      description: 'Test transfer',
    });

    const transaction = await getTransactionService({
      loggedInAccountId: senderAccount.id,
      transactionId: transfer.transaction.id,
    });

    expect(transaction?.toJSON()).toMatchObject(transfer.transaction.toJSON());
  });

  it('should not be able to get a transaction if the logged in account does not exist', async () => {
    expect(
      getTransactionService({
        loggedInAccountId: '60f7b3b3b3b3b3b3b3b3b3b3',
        transactionId: '60f7b3b3b3b3b3b3b3b3b3',
      }),
    ).rejects.toThrowError('Account not found');
  });

  it('should not be able to get a transaction if the transaction does not exist', async () => {
    const account = await createAccountService({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(
      getTransactionService({
        loggedInAccountId: account.id,
        transactionId: '60f7c4b4c6f4e5f2c0c1a6e0',
      }),
    ).rejects.toThrowError('Transaction not found');
  });
});
