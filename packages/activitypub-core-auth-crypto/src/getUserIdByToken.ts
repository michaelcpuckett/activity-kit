import { CryptoAuthAdapter } from '.';

export async function getUserIdByToken(
  this: CryptoAuthAdapter,
  token: string,
): Promise<string | null> {
  return this.params.cookieStore[token] || null;
}
