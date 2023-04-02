import * as crypto from "crypto";
import { NodeCryptoAdapter } from ".";

export async function generateKeyPair(this: NodeCryptoAdapter): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  return await new Promise((resolve, reject) => {
    const options: crypto.RSAKeyPairOptions<"pem", "pem"> = {
      modulusLength: 2048, // 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    };
    crypto.generateKeyPair(
      "rsa",
      options,
      (error: Error | null, publicKey: string, privateKey: string) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            publicKey,
            privateKey,
          });
        }
      }
    );
  });
}
