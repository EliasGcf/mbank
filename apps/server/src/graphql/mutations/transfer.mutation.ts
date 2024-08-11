import {
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { z } from 'zod';

import { AccountType } from '@graphql/types/account';

import { verifyJWT } from '@lib/jwt';
import { prisma } from '@lib/prisma';

const argsSchema = z.object({
  toAccountId: z.string(),
  amountInCents: z.number().refine((value) => value > 0, { message: 'Invalid amount' }),
});

export const transfer: GraphQLFieldConfig<unknown, { jwt: string }> = {
  type: new GraphQLObjectType({
    name: 'TransferPayload',
    fields: {
      me: {
        type: AccountType,
        description: 'The logged in account',
      },
    },
  }),
  args: {
    toAccountId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the account to transfer to',
    },
    amountInCents: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The amount to transfer in cents',
    },
  },
  resolve: async (_, _args, context) => {
    const { sub } = verifyJWT(context.jwt);
    const args = argsSchema.parse(_args);

    const fromAccount = await prisma.account.findUnique({
      where: { id: sub },
    });

    if (!fromAccount) throw new Error('From Account not found');

    const hasEnoughFunds = fromAccount.amountInCents >= args.amountInCents;

    if (!hasEnoughFunds) throw new Error('Insufficient funds');

    const toAccount = await prisma.account.findUnique({
      where: { id: args.toAccountId },
    });

    if (!toAccount) throw new Error('To Account not found');

    if (fromAccount.id === toAccount.id) {
      throw new Error('It is not possible to transfer to the same account');
    }

    const [updatedFromAccount] = await prisma.$transaction([
      prisma.account.update({
        where: { id: fromAccount.id },
        data: { amountInCents: { decrement: args.amountInCents } },
      }),
      prisma.account.update({
        where: { id: toAccount.id },
        data: { amountInCents: { increment: args.amountInCents } },
      }),
      prisma.transaction.create({
        data: {
          fromAccountId: fromAccount.id,
          toAccountId: toAccount.id,
          amountInCents: args.amountInCents,
        },
      }),
    ]);

    return {
      me: {
        id: updatedFromAccount.id,
        email: updatedFromAccount.email,
        amountInCents: updatedFromAccount.amountInCents,
      },
    };
  },
};
