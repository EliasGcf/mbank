import supertest from 'supertest';

import { prisma } from '@lib/prisma';

import { app } from '@app';

describe('(Mutation) CreateAccount', () => {
  it('should be able to create a new account', async () => {
    const response = await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation CreateAccount($data: CreateAccountInput!) {
            CreateAccount(input: $data) {
              account {
                id
                name
                email
              }
            }
          }
        `,
        variables: {
          data: {
            name: 'User 01',
            email: 'user01@gmail.com',
            password: '123456',
            passwordConfirmation: '123456',
          },
        },
      })
      .expect(200);

    const rawAccount = await prisma.account.findUnique({
      where: { email: 'user01@gmail.com' },
    });

    expect(rawAccount).toBeTruthy();
    expect(response.body.data.CreateAccount).toMatchObject({
      account: {
        name: 'User 01',
        email: 'user01@gmail.com',
      },
    });
  });

  it('should not be able to create a account with existent email', async () => {
    await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation CreateAccount($data: CreateAccountInput!) {
            CreateAccount(input: $data) {
              account { id }
            }
          }
        `,
        variables: {
          data: {
            name: 'User 01',
            email: 'user01@gmail.com',
            password: '123456',
            passwordConfirmation: '123456',
          },
        },
      })
      .expect(200);

    const response = await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation CreateAccount($data: CreateAccountInput!) {
            CreateAccount(input: $data) {
              account { id }
            }
          }
        `,
        variables: {
          data: {
            name: 'User 01',
            email: 'user01@gmail.com',
            password: '123456',
            passwordConfirmation: '123456',
          },
        },
      })
      .expect(200);

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Email not available' }),
      ]),
    );
  });

  it.skip('should not be able to create a account with different password and passwordConfirmation', async () => {
    const response = await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation CreateAccount($data: CreateAccountInput!) {
            CreateAccount(input: $data) {
              account { id }
            }
          }
        `,
        variables: {
          data: {
            name: 'User 03',
            email: 'user02@gmail.com',
            password: '123456',
            passwordConfirmation: '123457',
          },
        },
      })
      .expect(200);

    // Missing error handling from Zod Erros
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: "Passwords don't match" }),
      ]),
    );
  });
});
