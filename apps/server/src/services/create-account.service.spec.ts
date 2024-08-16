import { Account } from '@models/account.model';

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

    const rawAccount = await Account.findById(account.id).select('+amountInCents');

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

    const countInDB = await Account.countDocuments({ email: accountData.email });

    expect(countInDB).toBe(1);
  });
});
