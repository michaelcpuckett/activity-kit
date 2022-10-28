import * as firebaseAdmin from 'firebase-admin';
import { FirebaseAuthenticationAdapter } from '.';

export async function createUser({
  email,
  password,
  preferredUsername,
}: {
  this: FirebaseAuthenticationAdapter;
  email: string;
  password: string;
  preferredUsername: string;
}) {
  if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp(this.appOptions);
  }

  return await firebaseAdmin.auth().createUser({
    email,
    emailVerified: false,
    password,
    displayName: preferredUsername,
    disabled: false,
  });
}
