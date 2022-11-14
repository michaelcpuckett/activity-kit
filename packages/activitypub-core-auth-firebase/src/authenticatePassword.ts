import { FirebaseAuthAdapter } from '.';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

export async function authenticatePassword(
  this: FirebaseAuthAdapter,
  email: string,
  password: string
): Promise<Boolean> {
  console.log('AUTHENTICATE PASSWORD');
  const app = initializeApp(this.appOptions);
  const auth = getAuth(app);
  const user = await signInWithEmailAndPassword(auth, email, password);
  console.log('user', user);

  if (user) {
    return true;
  }

  return false;
}
