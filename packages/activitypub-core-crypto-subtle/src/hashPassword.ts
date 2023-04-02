import { SubtleCryptoAdapter } from '.';

export async function hashPassword(
  this: SubtleCryptoAdapter,
  password: string,
  salt: string,
): Promise<string> {
  if (!(this.params.subtle instanceof SubtleCrypto)) {
    throw new Error('Bad crypto.');
  }

  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);

  const derivedKeyBuffer = await this.params.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-512',
    },
    await this.params.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits'],
    ),
    512,
  );

  const derivedKeyArray = new Uint8Array(derivedKeyBuffer);
  return Array.prototype.map
    .call(derivedKeyArray, (x: number) => ('00' + x.toString(16)).slice(-2))
    .join('');
}
