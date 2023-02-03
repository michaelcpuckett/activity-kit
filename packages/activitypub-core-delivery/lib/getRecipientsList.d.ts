import { AP } from 'activitypub-core-types';
import { DeliveryAdapter } from '.';
export declare function getRecipientsList(this: DeliveryAdapter, to: AP.EntityReference | AP.EntityReference[]): Promise<URL[]>;
