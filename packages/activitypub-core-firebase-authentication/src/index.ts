import * as firebaseAdmin from 'firebase-admin';
import { AppOptions, ServiceAccount } from 'firebase-admin';
import type { Auth } from 'activitypub-core-types';
import { createUser } from './createUser';
import { getUserIdByToken } from './getUserIdByToken';

export class FirebaseAuthenticationAdapter implements Auth {
  appOptions: AppOptions;

  constructor(serviceAccount: ServiceAccount, projectId: string) {
    this.appOptions = {
      credential: firebaseAdmin.credential.cert(serviceAccount),
      projectId,
    };
  }

  public createUser = createUser;
  public getUserIdByToken = getUserIdByToken;
}
