import { CryptoAuthAdapter } from '.';
import { subtle } from 'crypto';

async function verifyPassword(
  rawPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  const [saltString, storedHashedPassword] = hashedPassword.split(':');

  const encoder = new TextEncoder();
  const salt = encoder.encode(saltString);
  const storedPassword = encoder.encode(storedHashedPassword);
  const password = encoder.encode(rawPassword);

  const key = await subtle.importKey(
    'raw',
    password,
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );

  const iterations = 10000;
  const derivedKey = await subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    key,
    256,
  );

  return derivedKey === storedPassword;
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
