import { CryptoAuthAdapter } from '.';
import { randomBytes } from 'crypto';

export function getTokenByUserId(
  this: CryptoAuthAdapter,
  userId: string,
): string {
  const token = randomBytes(16).toString('hex');
  this.params.cookieStore[token] = userId;
  return token;
}
