import { hash } from 'bcryptjs';
import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql';
import { z } from 'zod';

import { AccountType } from '@graphql/types/account';

import { prisma } from '@lib/prisma';

const argsSchema = z
  .object({
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

export const createAccount: GraphQLFieldConfig<unknown, unknown> = {
  type: AccountType,
  args: {
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
  resolve: async (_, _args) => {
    const args = argsSchema.parse(_args);

    const accountByEmailExists = await prisma.account.findUnique({
      where: { email: args.email },
    });

    if (accountByEmailExists) throw new Error('Account already exists');

    const account = await prisma.account.create({
      data: {
        email: args.email,
        password: await hash(args.password, 6),
        amountInCents: 0,
      },
    });

    return {
      id: account.id,
      email: account.email,
      amountInCents: account.amountInCents,
    };
  },
};
