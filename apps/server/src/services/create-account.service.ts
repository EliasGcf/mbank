import { hash } from 'bcryptjs';

import { Account } from '../models/account.model';

interface CreateAccountParams {
  name: string;
  email: string;
  password: string;
}

export async function createAccountService(params: CreateAccountParams) {
  const accountByEmailExists = await Account.findOne({ email: params.email });

  if (accountByEmailExists) throw new Error('Email not available');

  const hashedPassword = await hash(params.password, 6);

  const account = new Account({
    email: params.email,
    password: hashedPassword,
    name: params.name,
  });

  await account.save();

  return account;
}
