import * as AP from '@activity-kit/types';
import { CoreLibrary } from '.';
/**
 * Convert an Entity to a full object, expanding any references to other
 * Entities.
 *
 * @returns A Promise that resolves to the expanded Entity.
 */
export declare function expandEntity(this: CoreLibrary, entity: AP.Entity): Promise<AP.Entity>;
