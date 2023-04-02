import { AP } from '../';

export type CryptoAdapter = {
  params: {
    [key: string]: unknown;
  };

  hashPassword(
    this: CryptoAdapter,
    password: string,
    salt: string,
  ): Promise<string>;
  generateKeyPair: (this: CryptoAdapter) => Promise<{
    privateKey: string;
    publicKey: string;
  }>;
  getHttpSignature(
    this: CryptoAdapter,
    foreignTarget: URL,
    actorId: URL,
    privateKey: string,
    entity?: AP.Entity,
  ): Promise<{
    dateHeader: string;
    digestHeader?: string;
    signatureHeader: string;
  }>;
  randomBytes: (this: CryptoAdapter, numberOfBytes: number) => Promise<string>;
};
