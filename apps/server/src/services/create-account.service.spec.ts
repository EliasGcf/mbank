import { prisma } from '@lib/prisma';

import { createAccountService } from '@services/create-account.service';

describe('CreateAccountService', () => {
  it('should be able to create an account', async () => {
    const account = await createAccountService({
      name: 'User 01',
      email: 'user01@gmail.com',
      password: '123456',
    });

    expect(account).toHaveProperty('id');
    expect(account.id).toBeTypeOf('string');

    const rawAccount = await prisma.account.findUnique({
      where: { id: account.id },
      omit: { amountInCents: false },
    });

    expect(rawAccount).not.toBeNull();
    expect(rawAccount).toMatchObject({
      name: 'User 01',
      email: 'user01@gmail.com',
      amountInCents: 0,
    });
  });

  it('should not be able to create an account with an existing email', async () => {
    const accountData = {
      name: 'User 02',
      email: 'user02@gmail.com',
      password: '123456',
    };

    await createAccountService(accountData);

    expect(createAccountService(accountData)).rejects.toThrowError('Email not available');

    const countInDB = await prisma.account.count({ where: { email: accountData.email } });

    expect(countInDB).toBe(1);
  });
});
