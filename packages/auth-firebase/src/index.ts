import * as firebaseAdmin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import type { AuthAdapter } from '@activity-kit/types';
import { createUser } from './createUser';
import { getUserIdByToken } from './getUserIdByToken';
import { getTokenByUserId } from './getTokenByUserId';
import { authenticatePassword } from './authenticatePassword';

export class FirebaseAuthAdapter implements AuthAdapter {
  params?: {
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
