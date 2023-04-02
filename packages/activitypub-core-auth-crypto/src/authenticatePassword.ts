import { CryptoAuthAdapter } from '.';

async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const [salt, storedHashedPassword] = hashedPassword.split(':');
  const derivedKey = await this.adapters.crypto.hashPassword(password, salt);
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
    const token = await this.getTokenByUserId(uid);

    return {
      uid,
      token,
    };
  }

  return null;
}
