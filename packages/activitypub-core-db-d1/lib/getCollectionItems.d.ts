import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getCollectionItems(this: D1DbAdapter, entity: URL | AP.Collection | AP.OrderedCollection): Promise<AP.EntityReference[]>;
