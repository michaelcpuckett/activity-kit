import { SubtleCryptoAdapter } from '.';

export async function generateKeyPair(this: SubtleCryptoAdapter): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  if (!(this.params.subtle instanceof SubtleCrypto)) {
    throw new Error('Bad crypto.');
  }

  const keys = await this.params.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const privateKeyPEM = await privateKeyToPEM(keys.privateKey);
  const publicKeyPEM = await publicKeyToPEM(keys.publicKey);

  return {
    privateKey: privateKeyPEM,
    publicKey: publicKeyPEM,
  };
}

async function privateKeyToPEM(key: CryptoKey): Promise<string> {
  const rawPrivateKey = await crypto.subtle.exportKey('pkcs8', key);
  const arrayPrivateKey = new Uint8Array(rawPrivateKey);

  const pemHeader = '-----BEGIN PRIVATE KEY-----\n';
  const pemFooter = '-----END PRIVATE KEY-----\n';
  const base64PrivateKey = btoa(String.fromCharCode(...arrayPrivateKey));

  let pemBody = '';
  for (let i = 0; i < base64PrivateKey.length; i += 64) {
    pemBody += base64PrivateKey.slice(i, i + 64) + '\n';
  }

  return pemHeader + pemBody + pemFooter;
}

async function publicKeyToPEM(key: CryptoKey): Promise<string> {
  const rawPublicKey = await crypto.subtle.exportKey('spki', key);
  const arrayPublicKey = new Uint8Array(rawPublicKey);

  const pemHeader = '-----BEGIN PUBLIC KEY-----\n';
  const pemFooter = '-----END PUBLIC KEY-----\n';
  const base64PublicKey = btoa(String.fromCharCode(...arrayPublicKey));

  let pemBody = '';
  for (let i = 0; i < base64PublicKey.length; i += 64) {
    pemBody += base64PublicKey.slice(i, i + 64) + '\n';
  }

  return pemHeader + pemBody + pemFooter;
}
