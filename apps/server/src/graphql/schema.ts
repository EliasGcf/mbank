import { GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

export const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    product: {
      type: ProductType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        console.log('resolve ~ parent:', parent);
        return {
          id: args.id,
          title: 'Teste',
        };
      },
    },
    user: {
      type: GraphQLString,
      resolve() {
        return 'Hello World';
      },
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createProduct: {
      type: ProductType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        // Your logic to create a new product goes here
        return {
          id: 'newProductId',
          title: args.title,
        };
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
