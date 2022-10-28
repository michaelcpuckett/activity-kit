/// <reference types="node" />
import { MongoDatabaseAdapterDb } from '.';
import { AP } from 'activitypub-core-types';
export declare function fetchEntityById(this: MongoDatabaseAdapterDb, id: URL): Promise<AP.Entity | null>;
