import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function fetchEntityById(this: D1DbAdapter, id: URL): Promise<AP.Entity | null>;
