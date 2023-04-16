import { FirebaseAuthAdapter } from '.';
import * as firebaseAdmin from 'firebase-admin';

export async function getUserIdByToken(
  this: FirebaseAuthAdapter,
  token: string,
): Promise<string> {
  if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp(this.params.appOptions);
  }

  const user = !token
    ? null
    : await firebaseAdmin
        .auth()
        .verifyIdToken(token)
        .then(async (userCredential) => {
          return userCredential ?? null;
        })
        .catch((error: unknown) => {
          console.error(String(error));
          return null;
        });

  if (user.uid) {
    return user.uid;
  }
  return '';
}
