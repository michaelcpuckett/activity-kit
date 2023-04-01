import type { AuthAdapter, DbAdapter } from 'activitypub-core-types';
import { createUser } from './createUser';
import { getUserIdByToken } from './getUserIdByToken';
import { getTokenByUserId } from './getTokenByUserId';
import { authenticatePassword } from './authenticatePassword';

export class SubtleAuthAdapter implements AuthAdapter {
  adapters: { db: DbAdapter };
  params: {
    [key: string]: unknown;
  };

  constructor(adapters: { db: DbAdapter }) {
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
