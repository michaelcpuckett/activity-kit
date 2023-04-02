import { SubtleCryptoAdapter } from '.';
export declare function generateKeyPair(this: SubtleCryptoAdapter): Promise<{
    privateKey: string;
    publicKey: string;
}>;
