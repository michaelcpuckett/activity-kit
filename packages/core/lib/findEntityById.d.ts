/// <reference types="node" />
import * as AP from '@activity-kit/types';
import { CoreLibrary } from '.';
/**
 * Finds an Entity by its ID, which is a URL.
 *
 * @returns The Entity, or null if not found.
 */
export declare function findEntityById(this: CoreLibrary, id: URL): Promise<AP.Entity | null>;
