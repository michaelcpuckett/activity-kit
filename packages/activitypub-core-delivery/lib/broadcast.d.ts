import { DeliveryAdapter } from '.';
import { AP } from 'activitypub-core-types';
export declare function broadcast(this: DeliveryAdapter, activity: AP.Activity, actor: AP.Actor): Promise<(void | Response)[]>;
