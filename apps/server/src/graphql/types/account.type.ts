import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import {
  connectionArgs,
  connectionFromPromisedArray,
  globalIdField,
} from 'graphql-relay';

import { nodeInterface } from '@graphql/queries/node.query';
import { TransactionConnection } from '@graphql/types/transaction.type';

import { verifyJWT } from '@lib/jwt';

import { getTransactionsService } from '@services/get-transactions.service';

export const AccountType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Account',
  description: 'Account',
  fields: {
    id: globalIdField('Account'),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (data) => data.name,
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (data) => data.email,
    },
    amountInCents: {
      type: GraphQLInt,
      resolve: (data, _, ctx) => {
        const jwt = verifyJWT(ctx.jwt);

        if (jwt?.sub !== data.id) return null;

        return data.amountInCents;
      },
    },
    transactions: {
      type: TransactionConnection.connectionType,
      description: 'A list of transactions for the current account',
      args: connectionArgs,
      resolve: async (account, args, ctx) => {
        const jwt = verifyJWT(ctx.jwt);

        if (!jwt) return null;
        if (jwt.sub !== account.id) return null;

        return connectionFromPromisedArray(
          getTransactionsService({ loggedInAccountId: jwt.sub }),
          args,
        );
      },
    },
  },
  interfaces: [nodeInterface],
});
