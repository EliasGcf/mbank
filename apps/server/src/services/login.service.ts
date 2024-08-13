import { compare } from 'bcryptjs';

import { signJWT } from '@lib/jwt';
import { prisma } from '@lib/prisma';

interface LoginParams {
  email: string;
  password: string;
}

export async function loginService(params: LoginParams) {
  const account = await prisma.account.findUnique({
    where: { email: params.email },
    omit: { password: false },
  });

  if (!account) throw new Error('Invalid credentials');

  const isPasswordValid = await compare(params.password, account.password);

  if (!isPasswordValid) throw new Error('Invalid credentials');

  const token = signJWT({ sub: account.id });

  return { token, account };
}
