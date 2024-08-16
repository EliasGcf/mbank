import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

import { nodeInterface } from '@graphql/queries/node.query';

import { verifyRequiredJWT } from '@lib/jwt';

import { TransactionProps } from '@models/transaction.model';

import { getAccountService } from '@services/get-account.service';

export const TransactionType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Transaction',
  fields: () => ({
    id: globalIdField('Transaction'),
    idempotenceKey: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The idempotence key of the transaction',
    },
    fromAccount: {
      type: new GraphQLNonNull(require('./account.type').AccountType),
      resolve: async (data: TransactionProps, _, ctx) => {
        const jwt = verifyRequiredJWT(ctx.jwt);

        const account = await getAccountService({
          accountId: data.fromAccountId.toString(),
          loggedInAccountId: jwt.sub,
        });

        return account;
      },
    },
    toAccount: {
      type: new GraphQLNonNull(require('./account.type').AccountType),
      resolve: async (data: TransactionProps, _, ctx) => {
        const jwt = verifyRequiredJWT(ctx.jwt);

        const account = await getAccountService({
          accountId: data.toAccountId.toString(),
          loggedInAccountId: jwt.sub,
        });

        return account;
      },
    },
    amountInCents: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (data) => data.amountInCents,
    },
    description: {
      type: GraphQLString,
      resolve: (data) => data.description,
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (data) => data.createdAt.toISOString(),
    },
  }),
  interfaces: [nodeInterface],
});

export const TransactionConnection = connectionDefinitions({
  name: 'Transaction',
  nodeType: TransactionType,
});
