import { createAccountService } from '@services/create-account.service';
import { getAccountByIdOrEmailService } from '@services/get-account-by-id-or-email.service';

describe('getAccountByIdOrEmailService', () => {
  it('should be able to get account by id with amountInCents', async () => {
    const { id } = await createAccountService({
      name: 'User 01',
      email: 'user01@gmail.com',
      password: '123456',
    });

    const account = await getAccountByIdOrEmailService({ loggedInAccountId: id });

    expect(account).toMatchObject({
      name: 'User 01',
      email: 'user01@gmail.com',
      amountInCents: 0,
    });
  });

  it('should be able to get account by email', async () => {
    const { id } = await createAccountService({
      name: 'User 02',
      email: 'user02@gmail.com',
      password: '123456',
    });

    const account = await getAccountByIdOrEmailService({
      email: 'user02@gmail.com',
      loggedInAccountId: id,
    });

    expect(account).toMatchObject({
      name: 'User 02',
      email: 'user02@gmail.com',
    });

    expect(account.amountInCents).toBeUndefined();
  });
});
