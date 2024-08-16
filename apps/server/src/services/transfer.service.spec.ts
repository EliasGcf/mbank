import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';

import { Account } from '@models/account.model';
import { Transaction } from '@models/transaction.model';

import { createAccountService } from '@services/create-account.service';
import { transferService } from '@services/transfer.service';

describe('TransferService', () => {
  it('should be able to transfer money between accounts', async () => {
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

    // Deposit
    senderAccount.amountInCents = 100_00;
    await senderAccount.save();

    const idempotenceKey = randomUUID();

    const { transaction, account: updatedSenderAccount } = await transferService({
      idempotenceKey,
      loggedInAccountId: senderAccount.id,
      toAccountId: recipientAccount.id,
      amountInCents: 10_00,
      description: 'Test transfer',
    });

    expect(updatedSenderAccount.amountInCents).toBe(90_00);

    const [rawSenderAccount, rawRecipientAccount, rawTransaction] = await Promise.all([
      Account.findById(senderAccount.id).select('+amountInCents'),
      Account.findById(recipientAccount.id).select('+amountInCents'),
      Transaction.findById(transaction.id),
    ]);

    expect(rawTransaction).toMatchObject({
      idempotenceKey,
      amountInCents: 10_00,
      description: 'Test transfer',
      fromAccountId: senderAccount._id,
      toAccountId: recipientAccount._id,
    });
    expect(rawSenderAccount?.amountInCents).toBe(90_00);
    expect(rawRecipientAccount?.amountInCents).toBe(10_00);
  });

  it('should not be able to transfer when have no enough balance', async () => {
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

    await expect(
      transferService({
        idempotenceKey: 'test',
        loggedInAccountId: senderAccount.id,
        toAccountId: recipientAccount.id,
        amountInCents: 10_00,
        description: 'Test transfer',
      }),
    ).rejects.toThrow('Insufficient funds');

    const [rawSenderAccount, rawRecipientAccount, countTransactions] = await Promise.all([
      Account.findById(senderAccount.id).select('+amountInCents'),
      Account.findById(recipientAccount.id).select('+amountInCents'),
      Transaction.countDocuments({
        $or: [{ fromAccountId: senderAccount.id }, { toAccountId: senderAccount.id }],
      }),
    ]);

    expect(rawSenderAccount?.amountInCents).toBe(0);
    expect(rawRecipientAccount?.amountInCents).toBe(0);
    expect(countTransactions).toBe(0);
  });

  it('should not be able to transfer the same transaction twice', async () => {
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

    // Deposit
    senderAccount.amountInCents = 100_00;
    await senderAccount.save();

    const idempotenceKey = randomUUID();

    await transferService({
      idempotenceKey,
      loggedInAccountId: senderAccount.id,
      toAccountId: recipientAccount.id,
      amountInCents: 10_00,
      description: 'Test transfer 1',
    });

    const { account: updatedSenderAccount } = await transferService({
      idempotenceKey,
      loggedInAccountId: senderAccount.id,
      toAccountId: recipientAccount.id,
      amountInCents: 20_00,
      description: 'Test transfer 2',
    });

    expect(updatedSenderAccount.amountInCents).toBe(90_00);

    const [rawSenderAccount, rawRecipientAccount, countTransactions] = await Promise.all([
      Account.findById(senderAccount.id).select('+amountInCents'),
      Account.findById(recipientAccount.id).select('+amountInCents'),
      Transaction.countDocuments({
        $or: [{ fromAccountId: senderAccount.id }, { toAccountId: senderAccount.id }],
      }),
    ]);

    expect(countTransactions).toBe(1);
    expect(rawSenderAccount?.amountInCents).toBe(90_00);
    expect(rawRecipientAccount?.amountInCents).toBe(10_00);
  });
});
