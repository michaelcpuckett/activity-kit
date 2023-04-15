import { CoreLibrary } from '.';
import { AP } from 'activitypub-core-types';
export declare function findEntityById(this: CoreLibrary, id: URL): Promise<AP.Entity | null>;
