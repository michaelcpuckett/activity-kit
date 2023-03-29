import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function expandEntity(this: D1DbAdapter, originalEntity: AP.Entity): Promise<AP.Entity>;
