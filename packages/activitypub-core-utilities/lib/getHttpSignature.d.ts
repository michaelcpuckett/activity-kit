/// <reference types="node" />
import { AP } from 'activitypub-core-types';
export declare function getHttpSignature(foreignTarget: URL, actorId: URL, privateKey: string, entity?: AP.Entity): Promise<{
    dateHeader: string;
    digestHeader: string;
    signatureHeader: string;
}>;
