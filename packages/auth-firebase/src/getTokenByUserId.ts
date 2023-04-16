import { FirebaseAuthAdapter } from '.';

export async function getTokenByUserId(
  this: FirebaseAuthAdapter,
  userId: string,
): Promise<string> {
  return userId;
}
