import { faker } from '@faker-js/faker';
import { fromGlobalId } from 'graphql-relay';
import supertest from 'supertest';

import { app } from '@app';

export async function createFakeAccount() {
  const data = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

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
          name: data.name,
          email: data.email,
          password: data.password,
          passwordConfirmation: data.password,
        },
      },
    });

  return {
    globalId: response.body.data.CreateAccount.account.id,
    id: fromGlobalId(response.body.data.CreateAccount.account.id).id,
    ...data,
  };
}
