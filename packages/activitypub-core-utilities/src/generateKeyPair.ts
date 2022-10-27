import * as crypto from 'crypto';

export async function generateKeyPair(): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  return await new Promise((resolve, reject) => {
    const options: crypto.RSAKeyPairOptions<'pem', 'pem'> = {
      modulusLength: 2048, // 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    };
    crypto.generateKeyPair('rsa', options, (error: Error|null, publicKey: string, privateKey: string) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          publicKey,
          privateKey,
        });
      }
    });
  });
}
