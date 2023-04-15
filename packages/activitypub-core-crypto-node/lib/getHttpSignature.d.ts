/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import { NodeCryptoAdapter } from '.';
export declare function getHttpSignature(this: NodeCryptoAdapter, foreignTarget: URL, actorId: URL, privateKey: string, entity?: AP.Entity): Promise<{
    dateHeader: string;
    digestHeader?: string;
    signatureHeader: string;
}>;
