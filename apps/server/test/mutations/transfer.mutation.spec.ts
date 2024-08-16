import { randomUUID } from 'node:crypto';

import supertest from 'supertest';

import { Account } from '@models/account.model';
import { Transaction } from '@models/transaction.model';

import { app } from '@app';

import { createFakeAccount } from '../utils/create-fake-account';

describe('(Mutation) Transfer', () => {
  it('should be able to transfer money from the logged in account to another account', async () => {
    const [senderAccount, recipientAccount] = await Promise.all([
      createFakeAccount(),
      createFakeAccount(),
    ]);

    await Account.updateOne({ email: senderAccount.email }, { amountInCents: 100_00 });

    const loginResponse = await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation Login($data: LoginInput!) {
            Login(input: $data) { token }
          }
        `,
        variables: {
          data: {
            email: senderAccount.email,
            password: senderAccount.password,
          },
        },
      })
      .expect(200);

    const { token } = loginResponse.body.data.Login;

    const idempotenceKey = randomUUID();

    await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation Transfer($data: TransferInput!) {
            Transfer(input: $data) {
              transaction { id }
            }
          }
        `,
        variables: {
          data: {
            idempotenceKey,
            toAccountId: recipientAccount.globalId,
            amountInCents: 10_00,
            description: 'Test transfer',
          },
        },
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const rawTransfer = await Transaction.findOne({ idempotenceKey });

    expect(rawTransfer).toBeTruthy();
    expect(JSON.parse(JSON.stringify(rawTransfer))).toMatchObject({
      fromAccountId: senderAccount.id,
      toAccountId: recipientAccount.id,
      amountInCents: 10_00,
      description: 'Test transfer',
    });

    const [rawSender, rawRecipient] = await Promise.all([
      Account.findById(senderAccount.id).select('+amountInCents'),
      Account.findById(recipientAccount.id).select('+amountInCents'),
    ]);

    expect(rawSender?.amountInCents).toBe(90_00);
    expect(rawRecipient?.amountInCents).toBe(10_00);
  });

  it('should not be able to transfer when have no enough balance', async () => {
    const [senderAccount, recipientAccount] = await Promise.all([
      createFakeAccount(),
      createFakeAccount(),
    ]);

    const loginResponse = await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation Login($data: LoginInput!) {
            Login(input: $data) { token }
          }
        `,
        variables: {
          data: {
            email: senderAccount.email,
            password: senderAccount.password,
          },
        },
      })
      .expect(200);

    const { token } = loginResponse.body.data.Login;

    const idempotenceKey = randomUUID();

    const response = await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
        mutation Transfer($data: TransferInput!) {
          Transfer(input: $data) {
            transaction { id }
          }
        }
      `,
        variables: {
          data: {
            idempotenceKey,
            toAccountId: recipientAccount.globalId,
            amountInCents: 10_00,
            description: 'Test transfer',
          },
        },
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Insufficient funds' }),
      ]),
    );

    const rawTransfer = await Transaction.findOne({ idempotenceKey });

    expect(rawTransfer).toBeNull();
  });

  it('should not be able to transfer the same transaction twice', async () => {
    const [senderAccount, recipientAccount] = await Promise.all([
      createFakeAccount(),
      createFakeAccount(),
    ]);

    await Account.updateOne({ email: senderAccount.email }, { amountInCents: 100_00 });

    const loginResponse = await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation Login($data: LoginInput!) {
            Login(input: $data) { token }
          }
        `,
        variables: {
          data: {
            email: senderAccount.email,
            password: senderAccount.password,
          },
        },
      })
      .expect(200);

    const { token } = loginResponse.body.data.Login;

    const idempotenceKey = randomUUID();

    await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation Transfer($data: TransferInput!) {
            Transfer(input: $data) {
              transaction { id }
            }
          }
        `,
        variables: {
          data: {
            idempotenceKey,
            toAccountId: recipientAccount.globalId,
            amountInCents: 10_00,
            description: 'Test transfer',
          },
        },
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation Transfer($data: TransferInput!) {
            Transfer(input: $data) {
              transaction { id }
            }
          }
        `,
        variables: {
          data: {
            idempotenceKey,
            toAccountId: recipientAccount.globalId,
            amountInCents: 10_00,
            description: 'Test transfer',
          },
        },
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const rawSender = await Account.findById(senderAccount.id).select('+amountInCents');

    expect(rawSender?.amountInCents).toBe(90_00);
  });
});
