/// <reference types="node" />
import { CoreLibrary } from '.';
import { AP } from 'activitypub-core-types';
export declare function getRecipientUrls(this: CoreLibrary, activity: AP.Activity): Promise<URL[]>;
