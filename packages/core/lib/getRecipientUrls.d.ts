/// <reference types="node" />
import { Core } from '.';
import { AP } from '@activity-kit/types';
export declare function getRecipientUrls(this: Core, activity: AP.Activity): Promise<URL[]>;
