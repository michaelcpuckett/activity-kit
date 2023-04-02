import { CryptoAdapter } from 'activitypub-core-types';
import { generateKeyPair } from './generateKeyPair';
import { randomBytes } from './randomBytes';
import { hashPassword } from './hashPassword';
import { getHttpSignature } from './getHttpSignature';
export declare class NodeCryptoAdapter implements CryptoAdapter {
    params: {
        [key: string]: unknown;
    };
    generateKeyPair: typeof generateKeyPair;
    randomBytes: typeof randomBytes;
    hashPassword: typeof hashPassword;
    getHttpSignature: typeof getHttpSignature;
}
