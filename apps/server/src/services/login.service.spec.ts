import { verifyJWT } from '@lib/jwt';

import { createAccountService } from '@services/create-account.service';
import { loginService } from '@services/login.service';

describe('LoginService', () => {
  it('should be able to login and get the authentication token', async () => {
    const account = await createAccountService({
      name: 'User 01',
      email: 'user01@gmail.com',
      password: '123456',
    });

    const { token } = await loginService({
      email: account.email,
      password: '123456',
    });

    expect(token).toBeTypeOf('string');
    expect(verifyJWT(token)).toMatchObject({ sub: account.id });
  });

  it('should not be able to login with an incorrect email or password', async () => {
    const account = await createAccountService({
      name: 'User 02',
      email: 'user02@gmail.com',
      password: '123456',
    });

    expect(
      loginService({ email: account.email, password: '1234567' }),
    ).rejects.toThrowError('Invalid credentials');

    expect(
      loginService({ email: 'fake@gmail.com', password: '123456' }),
    ).rejects.toThrowError('Invalid credentials');
  });
});
