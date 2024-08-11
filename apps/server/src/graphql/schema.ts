import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

import { createAccount } from '@graphql/mutations/create-account.mutation';
import { login } from '@graphql/mutations/login.mutation';
import { transfer } from '@graphql/mutations/transfer.mutation';
import { me } from '@graphql/queries/me.query';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello world!',
    },
    me,
  },
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createAccount,
    login,
    transfer,
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
