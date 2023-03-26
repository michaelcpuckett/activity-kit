import * as firebaseAdmin from 'firebase-admin';
import { FirebaseAuthAdapter } from '.';

export async function createUser(
  this: FirebaseAuthAdapter,
  {
    email,
    password,
    preferredUsername,
  }: {
    email: string;
    password?: string;
    preferredUsername: string;
  },
) {
  if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp(this.appOptions);
  }

  return await firebaseAdmin.auth().createUser({
    email,
    emailVerified: false,
    ...(password
      ? {
          password,
        }
      : null),
    displayName: preferredUsername,
    disabled: false,
  });
}
