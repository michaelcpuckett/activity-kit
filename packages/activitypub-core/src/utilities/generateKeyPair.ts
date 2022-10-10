import * as crypto from 'crypto';

export async function generateKeyPair(): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  return await new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      'rsa',
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      },
      (error, publicKey, privateKey) => {
        if (error) {
          reject(error);
        }

        resolve({
          publicKey,
          privateKey,
        });
      },
    );
  });
}
