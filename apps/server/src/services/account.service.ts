import { compare, hash } from 'bcryptjs';

import { signJWT } from '@lib/jwt';
import { prisma } from '@lib/prisma';

interface GetAccountParams {
  loggedInAccountId: string;
  accountId: string;
}

export async function getAccount(params: GetAccountParams) {
  const account = await prisma.account.findUnique({
    where: { id: params.accountId },
    omit: { amountInCents: params.loggedInAccountId !== params.accountId },
  });

  if (!account) throw new Error('Account not found');

  return account;
}

interface CreateAccountParams {
  name: string;
  email: string;
  password: string;
}

export async function createAccount(params: CreateAccountParams) {
  const accountByEmailExists = await prisma.account.findUnique({
    where: { email: params.email },
  });

  if (accountByEmailExists) throw new Error('Email already in use');

  const account = await prisma.account.create({
    data: {
      email: params.email,
      password: await hash(params.password, 6),
      amountInCents: 0,
      name: params.name,
    },
  });

  return account;
}

interface LoginParams {
  email: string;
  password: string;
}

export async function login(params: LoginParams) {
  const account = await prisma.account.findUnique({
    where: { email: params.email },
    omit: { password: false },
  });

  if (!account) throw new Error('Invalid email or password');

  const isPasswordValid = await compare(params.password, account.password);

  if (!isPasswordValid) throw new Error('Invalid email or password');

  const token = signJWT({ sub: account.id });

  return { token, account };
}
