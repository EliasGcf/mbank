import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';

import { nodeInterface } from '@graphql/queries/node.query';
import { getAccount } from '@services/account.service';

import { verifyRequiredJWT } from '@lib/jwt';

export const TransactionType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Transaction',
  fields: () => ({
    id: globalIdField('Transaction'),
    fromAccount: {
      type: new GraphQLNonNull(require('./account.type').AccountType),
      resolve: async (data, _, ctx) => {
        const jwt = verifyRequiredJWT(ctx.jwt);

        const account = await getAccount({
          accountId: data.fromAccountId,
          loggedInAccountId: jwt.sub,
        });

        return account;
      },
    },
    toAccount: {
      type: new GraphQLNonNull(require('./account.type').AccountType),
      resolve: async (data, _, ctx) => {
        const jwt = verifyRequiredJWT(ctx.jwt);

        const account = await getAccount({
          accountId: data.toAccountId,
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
