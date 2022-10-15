/// <reference types="node" />
import { AP } from 'activitypub-core-types';
import { DeliveryService } from '.';
export declare function getRecipientsList(this: DeliveryService, to: AP.EntityReference | AP.EntityReference[]): Promise<URL[]>;
