import { compare } from 'bcryptjs';

import { signJWT } from '@lib/jwt';

import { Account } from '@models/account.model';

interface LoginParams {
  email: string;
  password: string;
}

export async function loginService(params: LoginParams) {
  const account = await Account.findOne({ email: params.email }).select('+password');

  if (!account) throw new Error('Invalid credentials');

  const isPasswordValid = await compare(params.password, account.password);

  if (!isPasswordValid) throw new Error('Invalid credentials');

  const token = signJWT({ sub: account.id });

  return { token, account };
}
