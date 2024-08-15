import { GraphQLFieldConfig, GraphQLString } from 'graphql';
import z from 'zod';

import { AccountType } from '@graphql/types/account.type';

import { verifyRequiredJWT } from '@lib/jwt';

import { getAccountByIdOrEmailService } from '@services/get-account-by-id-or-email.service';

const argsSchema = z.object({
  email: z.string().email().optional(),
});

export const AccountQuery: GraphQLFieldConfig<unknown, { jwt: string }> = {
  type: AccountType,
  args: {
    email: { type: GraphQLString },
  },
  resolve: async (_source, _args, ctx) => {
    const { sub } = verifyRequiredJWT(ctx.jwt);
    const args = argsSchema.parse(_args);

    return getAccountByIdOrEmailService({
      loggedInAccountId: sub,
      email: args.email,
    });
  },
};
