import { FirebaseAuthAdapter } from '.';

export function getTokenByUserId(
  this: FirebaseAuthAdapter,
  userId: string,
): string {
  return userId;
}
