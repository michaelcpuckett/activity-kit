import { CryptoAuthAdapter } from '.';
import { pbkdf2, randomBytes } from 'crypto';

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = await new Promise<string>((resolve, reject) => {
    pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });

  return `${salt}:${hashedPassword}`;
}

export async function createUser(
  this: CryptoAuthAdapter,
  {
    email,
    password,
    preferredUsername,
  }: {
    email: string;
    password?: string;
    preferredUsername: string;
  },
) {
  const uid = randomBytes(16).toString('hex');
  const hashedPassword = await hashPassword(password);
  const token = this.getTokenByUserId(uid);
  this.adapters.db.saveString('username', uid, preferredUsername);
  this.adapters.db.saveString('email', uid, email);
  this.adapters.db.saveString('hashedPassword', uid, hashedPassword);

  return { uid, token };
}
