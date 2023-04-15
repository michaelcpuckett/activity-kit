import { DataLayer } from '.';
import { AP } from 'activitypub-core-types';
export declare function findEntityById(this: DataLayer, id: URL): Promise<AP.Entity | null>;
