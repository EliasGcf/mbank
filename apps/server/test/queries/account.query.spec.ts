import supertest from 'supertest';

import { app } from '@app';

import { createFakeAccount } from '../utils/create-fake-account';

describe('(Query) account', () => {
  it('should be able to get the logged in account', async () => {
    const [senderAccount] = await Promise.all([createFakeAccount()]);

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

    const response = await supertest(app.callback())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query Account {
            account {
              id
              name
              email
              amountInCents
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.data.account).toMatchObject({
      id: senderAccount.globalId,
      name: senderAccount.name,
      amountInCents: 0,
    });
  });

  it('should be able to get account by email', async () => {
    const [senderAccount, recipientAccount] = await Promise.all([
      createFakeAccount(),
      createFakeAccount(),
    ]);

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

    const response = await supertest(app.callback())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query Account($email: String!) {
            account(email: $email) {
              id
              name
              email
              amountInCents
            }
          }
        `,
        variables: {
          email: recipientAccount.email,
        },
      })
      .expect(200);

    expect(response.body.data.account).toMatchObject({
      id: recipientAccount.globalId,
      name: recipientAccount.name,
      amountInCents: null,
    });
  });
});
