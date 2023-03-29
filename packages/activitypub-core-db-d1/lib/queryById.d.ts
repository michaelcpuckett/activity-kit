import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function queryById(this: D1DbAdapter, id: URL): Promise<AP.Entity | null>;
