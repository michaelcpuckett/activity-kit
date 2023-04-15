import { CoreLibrary } from '.';
import { AP } from 'activitypub-core-types';
export declare function queryById(this: CoreLibrary, id: URL): Promise<AP.Entity | null>;
