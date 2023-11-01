import * as AP from '@activity-kit/types';
import { CoreLibrary } from '.';
/**
 * Send an Activity to all of its recipients on behalf of an Actor.
 *
 * @returns A record of each URL and the HTTP status code of the response.
 */
export declare function broadcast(this: CoreLibrary, activity: AP.Activity, actor: AP.Actor): Promise<Record<string, number>>;
