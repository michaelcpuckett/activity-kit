import { AuthAdapter, CryptoAdapter, DbAdapter } from '@activity-kit/core';

import { createUser } from './createUser';
import { getUserIdByToken } from './getUserIdByToken';
import { getTokenByUserId } from './getTokenByUserId';
import { authenticatePassword } from './authenticatePassword';

export class TokenAuthAdapter implements AuthAdapter {
  adapters: { db: DbAdapter; crypto: CryptoAdapter };
  params: {
    [key: string]: unknown;
  };

  constructor(adapters: { db: DbAdapter; crypto: CryptoAdapter }) {
    this.adapters = adapters;
    this.params = {
      cookieStore: {},
    };
  }

  public authenticatePassword = authenticatePassword;
  public createUser = createUser;
  public getUserIdByToken = getUserIdByToken;
  public getTokenByUserId = getTokenByUserId;
}
