import { CryptoAuthAdapter } from '.';

export async function getUserIdByToken(
  this: CryptoAuthAdapter,
  token: string,
): Promise<string | null> {
  if (!('cookieStore' in this.params)) {
    throw new Error('Error');
  }

  return this.params.cookieStore[token] || null;
}
