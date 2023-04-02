import { SubtleCryptoAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getHttpSignature(this: SubtleCryptoAdapter, foreignTarget: URL, actorId: URL, privateKey: string, entity?: AP.Entity): Promise<{
    dateHeader: string;
    digestHeader?: string;
    signatureHeader: string;
}>;
