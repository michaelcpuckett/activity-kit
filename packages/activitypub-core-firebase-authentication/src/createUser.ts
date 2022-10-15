import * as firebaseAdmin from 'firebase-admin';
import { FirebaseAuthentication } from '.';

export async function createUser({
  email,
  password,
  preferredUsername,
}: {
  this: FirebaseAuthentication;
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