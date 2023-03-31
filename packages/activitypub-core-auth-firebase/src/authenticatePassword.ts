import { FirebaseAuthAdapter } from '.';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

export async function authenticatePassword(
  this: FirebaseAuthAdapter,
  email: string,
  password: string,
): Promise<{
  uid: string;
  token: string;
} | null> {
  const app = initializeApp(this.params.appOptions);
  const auth = getAuth(app);
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  if (user) {
    return {
      uid: user.uid,
      token: '',
    };
  }

  return null;
}
