import { DeliveryAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function isPublic(this: DeliveryAdapter, activity: AP.Activity): Promise<boolean>;
