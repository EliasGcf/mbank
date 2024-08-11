import { GraphQLFieldConfig } from 'graphql';

import { AccountType } from '@graphql/types/account';

import { verifyJWT } from '@lib/jwt';
import { prisma } from '@lib/prisma';

export const me: GraphQLFieldConfig<unknown, { jwt: string }> = {
  type: AccountType,
  description: 'Get the current account information.',
  resolve: async (_, __, context) => {
    const { sub } = verifyJWT(context.jwt);

    const account = await prisma.account.findUnique({
      where: { id: sub },
    });

    if (!account) throw new Error('Account not found');

    return {
      id: sub,
      email: account.email,
      amountInCents: account.amountInCents,
    };
  },
};
