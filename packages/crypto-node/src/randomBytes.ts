import { NodeCryptoAdapter } from ".";
import * as crypto from "crypto";

export async function randomBytes(
  this: NodeCryptoAdapter,
  numberOfBytes: number
): Promise<string> {
  return await new Promise((resolve, reject) => {
    crypto.randomBytes(numberOfBytes, (error: unknown, buffer: Buffer) => {
      if (error) {
        reject(error);
      }

      resolve(buffer.toString("hex"));
    });
  });
}
