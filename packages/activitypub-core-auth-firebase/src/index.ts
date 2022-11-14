import * as firebaseAdmin from 'firebase-admin';
import { AppOptions, ServiceAccount } from 'firebase-admin';
import type { AuthAdapter } from 'activitypub-core-types';
import { createUser } from './createUser';
import { getUserIdByToken } from './getUserIdByToken';
import { authenticatePassword } from './authenticatePassword';

export class FirebaseAuthAdapter implements AuthAdapter {
  appOptions: AppOptions;

  constructor(serviceAccount: ServiceAccount, projectId: string) {
    this.appOptions = {
      credential: firebaseAdmin.credential.cert(serviceAccount),
      projectId,
    };
  }
  
  public authenticatePassword = authenticatePassword;
  public createUser = createUser;
  public getUserIdByToken = getUserIdByToken;
}
