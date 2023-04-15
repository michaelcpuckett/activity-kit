import { DataLayer } from '.';
import { AP } from 'activitypub-core-types';
export declare function getCollectionItems(this: DataLayer, entity: AP.Collection | AP.OrderedCollection): Promise<AP.EntityReference[]>;
