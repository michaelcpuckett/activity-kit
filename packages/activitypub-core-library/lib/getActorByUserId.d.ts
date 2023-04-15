import { CoreLibrary } from '.';
import { AP } from 'activitypub-core-types';
export declare function getActorByUserId(this: CoreLibrary, userId: string): Promise<AP.Actor | null>;
