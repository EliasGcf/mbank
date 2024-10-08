import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import { z } from 'zod';

import { AccountType } from '@graphql/types/account.type';
import { TransactionType } from '@graphql/types/transaction.type';

import { verifyRequiredJWT } from '@lib/jwt';

import { transferService } from '@services/transfer.service';

const argsSchema = z.object({
  toAccountId: z.string(),
  amountInCents: z.number().int(),
  description: z.string().optional(),
  idempotenceKey: z.string(),
});

export const Transfer = mutationWithClientMutationId({
  name: 'Transfer',
  description: `Transfer money from the logged in account to another account. Require authentication.`,
  inputFields: {
    toAccountId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The global id of the account to transfer to',
    },
    amountInCents: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The amount to transfer in cents',
    },
    description: {
      type: GraphQLString,
      description: 'The description of the transfer',
    },
    idempotenceKey: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The idempotence key',
    },
  },
  mutateAndGetPayload: async (_args, ctx) => {
    const args = argsSchema.parse(_args);
    const { sub } = verifyRequiredJWT(ctx.jwt);
    const { id: toAccountId } = fromGlobalId(args.toAccountId);

    const { account, transaction } = await transferService({
      loggedInAccountId: sub,
      toAccountId,
      amountInCents: args.amountInCents,
      description: args.description,
      idempotenceKey: args.idempotenceKey,
    });

    return { account, transaction };
  },
  outputFields: {
    account: {
      type: AccountType,
      description: 'The logged in account',
      resolve: (payload) => payload.account,
    },
    transaction: {
      type: TransactionType,
      description: 'The transaction',
      resolve: (payload) => payload.transaction,
    },
  },
});
