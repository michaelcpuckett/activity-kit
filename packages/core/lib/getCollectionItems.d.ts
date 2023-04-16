import { Core } from '.';
import { AP } from '@activity-kit/types';
export declare function getCollectionItems(this: Core, entity: AP.Collection | AP.OrderedCollection): Promise<AP.EntityReference[]>;
