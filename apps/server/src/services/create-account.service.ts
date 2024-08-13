import { hash } from 'bcryptjs';

import { prisma } from '@lib/prisma';

interface CreateAccountParams {
  name: string;
  email: string;
  password: string;
}

export async function createAccountService(params: CreateAccountParams) {
  const accountByEmailExists = await prisma.account.findUnique({
    where: { email: params.email },
  });

  if (accountByEmailExists) throw new Error('Email not available');

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
