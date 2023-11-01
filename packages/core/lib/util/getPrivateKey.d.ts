import * as AP from '@activity-kit/types';
import { CoreLibrary } from '..';
/**
 * Get the private key of an Actor.
 *
 * @returns The private key as a string.
 */
export declare function getPrivateKey(this: CoreLibrary, actor: AP.Actor): Promise<string>;
