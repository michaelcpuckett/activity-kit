import { NodeCryptoAdapter } from ".";
export declare function generateKeyPair(this: NodeCryptoAdapter): Promise<{
    privateKey: string;
    publicKey: string;
}>;
