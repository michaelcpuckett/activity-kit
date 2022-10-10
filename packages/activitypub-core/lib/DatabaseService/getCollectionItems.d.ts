/// <reference types="node" />
import { DatabaseService } from '.';
import { AP } from '../types';
export declare function getCollectionItems(this: DatabaseService, entity: URL | AP.Collection | AP.OrderedCollection): Promise<AP.EntityReference[]>;
