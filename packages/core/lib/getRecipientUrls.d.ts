/// <reference types="node" />
import * as AP from '@activity-kit/types';
import { CoreLibrary } from '.';
/**
 * Given an Activity, get the URLs of all recipients.
 *
 * @returns An array of recipient URLs.
 */
export declare function getRecipientUrls(this: CoreLibrary, activity: AP.Activity): Promise<URL[]>;
