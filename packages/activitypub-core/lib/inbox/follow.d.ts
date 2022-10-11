import { AP } from 'activitypub-core-types';
import type { Database } from 'activitypub-core-types';
import { DeliveryService } from 'activitypub-core-delivery';
export declare function handleFollow(activity: AP.Follow, databaseService: Database, deliveryService: DeliveryService): Promise<void>;
