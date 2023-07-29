import { TokenAuthAdapter } from '.';

export async function createUser(
  this: TokenAuthAdapter,
  {
    email,
    password,
    preferredUsername,
  }: {
    email: string;
    password: string;
    preferredUsername: string;
  },
) {
  const existingUser = await this.adapters.db.findStringIdByValue(
    'account',
    email,
  );

  if (existingUser) {
    throw new Error('Account already exists.');
  }

  const salt = await this.adapters.crypto.randomBytes(16);
  const hashedPassword = await this.adapters.crypto.hashPassword(
    password,
    salt,
  );
  const uid = await this.adapters.crypto.randomBytes(16);
  const token = await this.getTokenByUserId(uid);
  this.adapters.db.saveString('username', uid, preferredUsername);
  this.adapters.db.saveString('email', uid, email);
  this.adapters.db.saveString(
    'hashedPassword',
    uid,
    `${salt}:${hashedPassword}`,
  );

  return { uid, token };
}
