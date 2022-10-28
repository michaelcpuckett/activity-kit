/// <reference types="node" />
import { MongoDatabaseAdapterDb } from '.';
import { AP } from 'activitypub-core-types';
export declare function getCollectionItems(this: MongoDatabaseAdapterDb, entity: URL | AP.Collection | AP.OrderedCollection): Promise<AP.EntityReference[]>;
