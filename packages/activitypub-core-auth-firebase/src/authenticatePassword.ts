import { FirebaseAuthAdapter } from '.';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

export async function authenticatePassword(
  this: FirebaseAuthAdapter,
  email: string,
  password: string
): Promise<Boolean> {
  const app = initializeApp(this.appOptions);
  const auth = getAuth(app);
  const user = await signInWithEmailAndPassword(auth, email, password);

  if (user) {
    return true;
  }

  return false;
}
