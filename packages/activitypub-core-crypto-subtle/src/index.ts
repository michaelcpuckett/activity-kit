import { CryptoAdapter } from 'activitypub-core-types';
import { generateKeyPair } from './generateKeyPair';
import { randomBytes } from './randomBytes';
import { hashPassword } from './hashPassword';
import { getHttpSignature } from './getHttpSignature';

export class SubtleCryptoAdapter implements CryptoAdapter {
  params: {
    [key: string]: unknown;
  };

  constructor(subtle: SubtleCrypto) {
    this.params.subtle = subtle;
  }

  public generateKeyPair = generateKeyPair;
  public randomBytes = randomBytes;
  public hashPassword = hashPassword;
  public getHttpSignature = getHttpSignature;
}
