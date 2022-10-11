import { DatabaseService } from '.';
import { AP } from 'activitypub-core-types/src';
import { ServiceAccount } from 'firebase-admin';
export declare function getActorByToken(this: DatabaseService, token: string, credentials: ServiceAccount): Promise<AP.Actor | null>;
