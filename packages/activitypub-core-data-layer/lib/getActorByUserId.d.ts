import { DataLayer } from '.';
import { AP } from 'activitypub-core-types';
export declare function getActorByUserId(this: DataLayer, userId: string): Promise<AP.Actor | null>;
