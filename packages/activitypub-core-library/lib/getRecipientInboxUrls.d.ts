/// <reference types="node" />
import { CoreLibrary } from '.';
import { AP } from 'activitypub-core-types';
export declare function getRecipientInboxUrls(this: CoreLibrary, activity: AP.Activity, actor: AP.Actor, inboxesOnly?: boolean): Promise<URL[]>;
