import { CryptoAuthAdapter } from '.';

export async function getUserIdByToken(
  this: CryptoAuthAdapter,
  token: string,
): Promise<string | null> {
  return (await this.adapters.db.findStringIdByValue('token', token)) ?? null;
}
