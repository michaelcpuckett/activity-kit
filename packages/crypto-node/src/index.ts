import { CryptoAdapter } from '@activity-kit/types';
import { generateKeyPair } from './generateKeyPair';
import { randomBytes } from './randomBytes';
import { hashPassword } from './hashPassword';
import { getHttpSignature } from './getHttpSignature';

export class NodeCryptoAdapter implements CryptoAdapter {
  params: {
    [key: string]: unknown;
  };

  public generateKeyPair = generateKeyPair;
  public randomBytes = randomBytes;
  public hashPassword = hashPassword;
  public getHttpSignature = getHttpSignature;
}
