/// <reference types="node" />
import { MongoDatabase } from '.';
import { AP } from 'activitypub-core-types';
export declare function getCollectionItems(this: MongoDatabase, entity: URL | AP.Collection | AP.OrderedCollection): Promise<AP.EntityReference[]>;
