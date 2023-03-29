import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getActorByUserId(this: D1DbAdapter, userId: string): Promise<AP.Actor | null>;
