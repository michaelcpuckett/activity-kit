import * as AP from '@activity-kit/types';
import { CoreLibrary } from '.';
/**
 * Finds a Stream by its name.
 *
 * @returns The Stream, or null if not found.
 */
export declare function getStreamByName(this: CoreLibrary, actor: AP.Actor, name: string): Promise<AP.EitherCollection | null>;
