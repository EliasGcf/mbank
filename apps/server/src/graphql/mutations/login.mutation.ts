import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { z } from 'zod';

import { AccountType } from '@graphql/types/account.type';

import { loginService } from '@services/login.service';

const argsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const Login = mutationWithClientMutationId({
  name: 'Login',
  description: 'Get the token to use for authentication',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The unique email of the account',
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The password of the account',
    },
  },
  mutateAndGetPayload: async (_args) => {
    const args = argsSchema.parse(_args);

    const { token, account } = await loginService({
      email: args.email,
      password: args.password,
    });

    return { token, account };
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: (payload) => payload.token,
    },
    account: {
      type: AccountType,
      resolve: (payload) => payload.account,
    },
  },
});
