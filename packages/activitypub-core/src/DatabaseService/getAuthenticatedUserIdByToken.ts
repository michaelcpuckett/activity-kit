import { DatabaseService } from '.';
import * as firebaseAdmin from 'firebase-admin';
import { AppOptions, ServiceAccount } from 'firebase-admin';

export async function getAuthenticatedUserIdByToken(
  this: DatabaseService,
  token: string,
  serviceAccount: ServiceAccount,
): Promise<string | null> {
  if (!firebaseAdmin.apps.length) {
    const appOptions: AppOptions = {
      credential: firebaseAdmin.credential.cert(serviceAccount),
      projectId: 'socialweb-id',
    };

    firebaseAdmin.initializeApp(appOptions);
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

  if (!user?.uid) {
    return null;
  }

  return user.uid;
}
