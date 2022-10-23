/// <reference types="node" />
import { AP } from 'activitypub-core-types';
export declare function getHttpSignature(foreignTarget: URL, actor: AP.Actor, entity: AP.Entity): Promise<{
    dateHeader: string;
    digestHeader: string;
    signatureHeader: string;
}>;
