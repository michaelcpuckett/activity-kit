import { CryptoAuthAdapter } from '.';
import { pbkdf2 } from 'crypto';

async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const [salt, storedHashedPassword] = hashedPassword.split(':');
  const derivedKey = await new Promise<string>((resolve, reject) => {
    pbkdf2(password, salt, 100000, 64, 'sha512', (err, key) => {
      if (err) reject(err);
      resolve(key.toString('hex'));
    });
  });
  return derivedKey === storedHashedPassword;
}

export async function authenticatePassword(
  this: CryptoAuthAdapter,
  email: string,
  password: string,
): Promise<{
  uid: string;
  token: string;
} | null> {
  const uid = await this.adapters.db.findStringIdByValue('email', email);

  if (!uid) {
    return null;
  }

  const hashedPassword = await this.adapters.db.findStringValueById(
    'hashedPassword',
    uid,
  );

  if (await verifyPassword(password, hashedPassword)) {
    const token = this.getTokenByUserId(uid);

    return {
      uid,
      token,
    };
  }

  return null;
}
