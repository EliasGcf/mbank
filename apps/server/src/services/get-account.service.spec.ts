import { createAccountService } from '@services/create-account.service';
import { getAccountService } from '@services/get-account.service';

describe('getAccountService', () => {
  it('should be able to get account with amountInCents', async () => {
    const { id } = await createAccountService({
      name: 'User 01',
      email: 'user01@gmail.com',
      password: '123456',
    });

    const account = await getAccountService({ accountId: id, loggedInAccountId: id });

    expect(account).toMatchObject({
      name: 'User 01',
      email: 'user01@gmail.com',
      amountInCents: 0,
    });
  });

  it("should not be able to get account with amountInCents when the logged in account is different from the account's owner", async () => {
    const { id } = await createAccountService({
      name: 'User 02',
      email: 'user02@gmail.com',
      password: '123456',
    });

    const { id: loggedInAccountId } = await createAccountService({
      name: 'User 03',
      email: 'user03@gmail.com',
      password: '123456',
    });

    const account = await getAccountService({ accountId: id, loggedInAccountId });

    expect(account).toMatchObject({
      name: 'User 02',
      email: 'user02@gmail.com',
    });

    expect(account.amountInCents).toBeUndefined();
  });

  it('should not be able to get account that does not exist', async () => {
    expect(
      getAccountService({
        // ObjectID
        accountId: '60f7c4b4c6f4e5f2c0c1a6e0',
        loggedInAccountId: '60f7c4b4c6f4e5f2c0c1a6e0',
      }),
    ).rejects.toThrowError('Account not found');
  });
});
