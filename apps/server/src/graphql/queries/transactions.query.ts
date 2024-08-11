import {
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { prisma } from '@lib/prisma';

export const transactionsQuery: GraphQLFieldConfig<{ id: string }, { jwt: string }> = {
  type: new GraphQLList(
    new GraphQLObjectType({
      name: 'Transfer',
      fields: {
        id: { type: GraphQLString },
        fromAccountId: { type: GraphQLString },
        toAccountId: { type: GraphQLString },
        amountInCents: { type: GraphQLInt },
        createdAt: { type: GraphQLString },
      },
    }),
  ),
  description: 'Get the current account transfers.',
  resolve: async (source) => {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ fromAccountId: source.id }, { toAccountId: source.id }],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      fromAccountId: transaction.fromAccountId,
      toAccountId: transaction.toAccountId,
      amountInCents:
        transaction.fromAccountId === source.id
          ? -transaction.amountInCents
          : transaction.amountInCents,
      createdAt: transaction.createdAt.toISOString(),
    }));
  },
};
