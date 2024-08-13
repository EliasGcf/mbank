import supertest from 'supertest';

import { app } from '@app';

import { createFakeAccount } from '../utils/create-fake-account';

describe('(Mutation) Login', () => {
  it('should be able to get the token to use for authentication', async () => {
    const fakeAccount = await createFakeAccount();

    const response = await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation Login($data: LoginInput!) {
            Login(input: $data) {
              token
            }
          }
        `,
        variables: {
          data: {
            email: fakeAccount.email,
            password: fakeAccount.password,
          },
        },
      })
      .expect(200);

    expect(response.body.data.Login.token).toBeTypeOf('string');
  });

  it('should not be able to login with wrong credentials', async () => {
    const fakeAccount = await createFakeAccount();

    const response = await supertest(app.callback())
      .post('/graphql')
      .send({
        query: `
          mutation Login($data: LoginInput!) {
            Login(input: $data) {
              token
            }
          }
        `,
        variables: {
          data: {
            email: fakeAccount.email,
            password: '123456',
          },
        },
      })
      .expect(200);

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Invalid credentials' }),
      ]),
    );
  });
});
