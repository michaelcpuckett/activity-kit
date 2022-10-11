import { DeliveryService } from '.';
import { AP } from 'activitypub-core-types';
export declare function broadcast(this: DeliveryService, activity: AP.Activity, actor: AP.Actor): Promise<any[]>;
