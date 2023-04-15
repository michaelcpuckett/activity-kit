import { DataLayer } from '.';
import { AP } from 'activitypub-core-types';
export declare function getRecipientUrls(this: DataLayer, activity: AP.Activity): Promise<URL[]>;
