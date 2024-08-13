import { randomUUID } from 'crypto';
import supertest from 'supertest';

import { prisma } from '@lib/prisma';

import { app } from '@app';

import { createFakeAccount } from '../utils/create-fake-account';

describe('(Query) Node', () => {
  it('should be able to get Account from node', async () => {
    const [senderAccount, recipientAccount] = await Promise.all([
      createFakeAccount(),
      createFakeAccount(),
    ]);

    await prisma.account.update({
      where: { email: senderAccount.email },
      data: { amountInCents: 100_00 },
    });

    const login = await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation Login($data: LoginInput!) {
            Login(input: $data) { token }
          }
        `,
        variables: {
          data: { email: senderAccount.email, password: senderAccount.password },
        },
      })
      .expect(200);

    const token = login.body.data.Login.token;

    const idempotenceKey = randomUUID();

    const transactionResponse = await supertest(app.callback())
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

    const response = await supertest(app.callback())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query {
            node(id: "${senderAccount.globalId}") {
              ... on Account {
                id
                name
                amountInCents
                transactions {
                  edges {
                    node {
                      amountInCents
                      createdAt
                      idempotenceKey
                      id
                      fromAccount {
                        id
                        email
                        amountInCents
                      }
                      toAccount {
                        id
                        email
                        amountInCents
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.data.node).toMatchObject({
      id: senderAccount.globalId,
      name: senderAccount.name,
      amountInCents: 90_00,
      transactions: {
        edges: [
          {
            node: {
              amountInCents: 10_00,
              idempotenceKey,
              id: transactionResponse.body.data.Transfer.transaction.id,
              fromAccount: {
                id: senderAccount.globalId,
                email: senderAccount.email,
                amountInCents: 90_00,
              },
              toAccount: {
                id: recipientAccount.globalId,
                email: recipientAccount.email,
                amountInCents: null,
              },
            },
          },
        ],
      },
    });
  });

  it('should be able to get Transaction from node', async () => {
    const [senderAccount, recipientAccount] = await Promise.all([
      createFakeAccount(),
      createFakeAccount(),
    ]);

    await prisma.account.update({
      where: { email: senderAccount.email },
      data: { amountInCents: 100_00 },
    });

    const login = await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation Login($data: LoginInput!) {
            Login(input: $data) { token }
          }
        `,
        variables: {
          data: { email: senderAccount.email, password: senderAccount.password },
        },
      })
      .expect(200);

    const token = login.body.data.Login.token;

    const idempotenceKey = randomUUID();

    const transactionResponse = await supertest(app.callback())
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

    const response = await supertest(app.callback())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query {
            node(id: "${transactionResponse.body.data.Transfer.transaction.id}") {
              ... on Transaction {
                id
                amountInCents
                idempotenceKey
                fromAccount {
                  id
                  email
                  amountInCents
                }
                toAccount {
                  id
                  email
                  amountInCents
                }
              }
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.data.node).toMatchObject({
      id: transactionResponse.body.data.Transfer.transaction.id,
      amountInCents: 10_00,
      idempotenceKey,
      fromAccount: {
        id: senderAccount.globalId,
        email: senderAccount.email,
        amountInCents: 90_00,
      },
      toAccount: {
        id: recipientAccount.globalId,
        email: recipientAccount.email,
        amountInCents: null,
      },
    });
  });
});
