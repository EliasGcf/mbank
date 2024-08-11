import { compare } from 'bcryptjs';
import {
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { z } from 'zod';

import { signJWT } from '@lib/jwt';
import { prisma } from '@lib/prisma';

const argsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const login: GraphQLFieldConfig<unknown, unknown> = {
  type: new GraphQLObjectType({
    name: 'AuthPayload',
    fields: {
      token: { type: GraphQLString },
    },
  }),
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The email to login with',
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The password to login with',
    },
  },
  resolve: async (_, _args) => {
    const args = argsSchema.parse(_args);

    const account = await prisma.account.findUnique({
      where: { email: args.email },
    });

    if (!account) throw new Error('Invalid email or password');

    const isPasswordValid = await compare(args.password, account.password);

    if (!isPasswordValid) throw new Error('Invalid email or password');

    const jwt = signJWT({ sub: account.id });

    return { token: jwt };
  },
};
