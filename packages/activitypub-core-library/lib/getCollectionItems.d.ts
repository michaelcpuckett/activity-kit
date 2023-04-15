import { CoreLibrary } from '.';
import { AP } from 'activitypub-core-types';
export declare function getCollectionItems(this: CoreLibrary, entity: AP.Collection | AP.OrderedCollection): Promise<AP.EntityReference[]>;
