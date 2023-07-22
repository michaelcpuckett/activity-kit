/// <reference types="node" />
import { Core } from '.';
import * as AP from '@activity-kit/types';
export declare function getRecipientInboxUrls(this: Core, activity: AP.Activity, actor: AP.Actor, inboxesOnly?: boolean): Promise<URL[]>;
