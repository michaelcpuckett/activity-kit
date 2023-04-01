import { SubtleAuthAdapter } from '.';

function assertSubtleExists(subtle: unknown): asserts subtle is SubtleCrypto {}

const randomBytes = (length: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

export async function createUser(
  this: SubtleAuthAdapter,
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
  const uid = randomBytes(16);

  assertSubtleExists(this.params.subtle);

  const hashPassword = async (rawPassword: string): Promise<string> => {
    const encoder = new TextEncoder();
    const password = encoder.encode(rawPassword);

    assertSubtleExists(this.params.subtle);

    const key = await this.params.subtle.importKey(
      'raw',
      password,
      { name: 'PBKDF2' },
      false,
      ['deriveBits'],
    );

    const saltString = randomBytes(16);
    const salt = encoder.encode(saltString);

    const iterations = 10000;
    const hashedPassword = await this.params.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      key,
      256,
    );

    return `${saltString}:${hashedPassword}`;
  };

  const hashedPassword = await hashPassword(password);
  const token = this.getTokenByUserId(uid);
  this.adapters.db.saveString('username', uid, preferredUsername);
  this.adapters.db.saveString('email', uid, email);
  this.adapters.db.saveString('hashedPassword', uid, hashedPassword);

  return { uid, token };
}
