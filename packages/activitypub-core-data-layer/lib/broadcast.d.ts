import { DataLayer } from '.';
import { AP } from 'activitypub-core-types';
export declare function broadcast(this: DataLayer, activity: AP.Activity, actor: AP.Actor): Promise<unknown>;
