import * as crypto from 'crypto';

export async function generateKeyPair(): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  return await new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      'rsa',
      {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        }
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
