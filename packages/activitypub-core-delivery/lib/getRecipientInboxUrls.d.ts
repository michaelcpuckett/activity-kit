import { DeliveryAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function getRecipientInboxUrls(this: DeliveryAdapter, activity: AP.Activity, actor: AP.Actor, inboxesOnly?: boolean): Promise<URL[]>;
