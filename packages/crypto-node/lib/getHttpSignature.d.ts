/// <reference types="node" />
import { NodeCryptoAdapter } from '.';
export declare function getHttpSignature(this: NodeCryptoAdapter, foreignTarget: URL, actorId: URL, privateKey: string, entity?: Record<string, unknown>): Promise<{
    dateHeader: string;
    digestHeader?: string;
    signatureHeader: string;
}>;
