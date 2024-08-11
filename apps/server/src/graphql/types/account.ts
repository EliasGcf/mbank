import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';

import { transactionsQuery } from '@graphql/queries/transactions.query';

export const AccountType = new GraphQLObjectType({
  name: 'Account',
  fields: {
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    amountInCents: { type: GraphQLInt },
    transactions: transactionsQuery,
  },
});
