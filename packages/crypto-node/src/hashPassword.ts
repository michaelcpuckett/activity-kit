import { pbkdf2 } from "crypto";
import { NodeCryptoAdapter } from ".";

export async function hashPassword(
  this: NodeCryptoAdapter,
  password: string,
  salt: string
): Promise<string> {
  return await new Promise((resolve, reject) => {
    pbkdf2(password, salt, 100000, 64, "sha512", (err, key) => {
      if (err) reject(err);
      resolve(key.toString("hex"));
    });
  });
}
