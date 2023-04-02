import { CryptoAuthAdapter } from '.';

export async function getTokenByUserId(
  this: CryptoAuthAdapter,
  userId: string,
): Promise<string> {
  const token = await this.adapters.crypto.randomBytes(16);

  if (!('cookieStore' in this.params)) {
    throw new Error('Error');
  }

  this.params.cookieStore[token] = userId;

  return token;
}
