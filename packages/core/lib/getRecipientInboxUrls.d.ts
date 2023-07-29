/// <reference types="node" />
import * as AP from '@activity-kit/types';
import { Core } from '.';
export declare function getRecipientInboxUrls(this: Core, activity: AP.Activity, actor: AP.Actor, inboxesOnly?: boolean): Promise<import("url").URL[]>;
