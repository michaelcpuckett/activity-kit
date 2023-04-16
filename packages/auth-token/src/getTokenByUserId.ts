import { CryptoAuthAdapter } from '.';

export async function getTokenByUserId(
  this: CryptoAuthAdapter,
  userId: string,
): Promise<string> {
  const token = await this.adapters.crypto.randomBytes(16);
  await this.adapters.db.saveString('token', userId, token);
  return token;
}
