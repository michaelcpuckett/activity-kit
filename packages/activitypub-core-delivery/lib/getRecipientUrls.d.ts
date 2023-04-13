import { DeliveryAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getRecipientUrls(this: DeliveryAdapter, activity: AP.Activity): Promise<URL[]>;
