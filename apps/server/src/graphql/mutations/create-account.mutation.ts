import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { z } from 'zod';

import { createAccount } from '@services/account.service';
import { AccountType } from '@graphql/types/account.type';

const argsSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    passwordConfirmation: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ['password', 'passwordConfirmation'],
      });
    }
  });

export const CreateAccount = mutationWithClientMutationId({
  name: 'CreateAccount',
  description: 'Create a new account',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the user account',
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The unique email of the account',
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The password of the account',
    },
    passwordConfirmation: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The password confirmation of the account',
    },
  },
  mutateAndGetPayload: async (_args) => {
    const args = argsSchema.parse(_args);

    const account = await createAccount({
      email: args.email,
      name: args.name,
      password: args.password,
    });

    return { account };
  },
  outputFields: {
    account: {
      type: AccountType,
      resolve: (payload) => payload.account,
    },
  },
});
