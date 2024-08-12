import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

import { CreateAccount } from '@graphql/mutations/create-account.mutation';
import { Login } from '@graphql/mutations/login.mutation';
import { Transfer } from '@graphql/mutations/transfer.mutation';
import { nodeField, nodesField } from '@graphql/queries/node.query';

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'The root Query type.',
  fields: {
    hello: { type: GraphQLString, resolve: () => 'Hello world!' },
    node: nodeField,
    nodes: nodesField,
  },
});

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root Mutation type.',
  fields: {
    CreateAccount,
    Login,
    Transfer,
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: MutationType,
});
