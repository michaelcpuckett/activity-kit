import { TokenAuthAdapter } from '.';

export async function getUserIdByToken(
  this: TokenAuthAdapter,
  token: string,
): Promise<string | null> {
  return (await this.adapters.db.findStringIdByValue('token', token)) ?? null;
}
