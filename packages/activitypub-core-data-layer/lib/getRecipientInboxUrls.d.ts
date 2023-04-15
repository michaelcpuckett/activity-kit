import { DataLayer } from '.';
import { AP } from 'activitypub-core-types';
export declare function getRecipientInboxUrls(this: DataLayer, activity: AP.Activity, actor: AP.Actor, inboxesOnly?: boolean): Promise<URL[]>;
