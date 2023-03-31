import * as firebaseAdmin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import type { DbAdapter, AuthAdapter } from 'activitypub-core-types';
import { createUser } from './createUser';
import { getUserIdByToken } from './getUserIdByToken';
import { getTokenByUserId } from './getTokenByUserId';
import { authenticatePassword } from './authenticatePassword';

export class FirebaseAuthAdapter implements AuthAdapter {
  adapters: { db: DbAdapter };
  params: {
    [key: string]: unknown;
  };

  constructor(serviceAccount: ServiceAccount, projectId: string) {
    this.params.appOptions = {
      credential: firebaseAdmin.credential.cert(serviceAccount),
      projectId,
    };
  }

  public authenticatePassword = authenticatePassword;
  public createUser = createUser;
  public getUserIdByToken = getUserIdByToken;
  public getTokenByUserId = getTokenByUserId;
}
