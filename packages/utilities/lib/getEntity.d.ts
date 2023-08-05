import * as AP from '@activity-kit/types';
/**
 *  Get the Entity from an EntityReference, if the EntityReference is an Entity.
 *
 * @returns The Entity, or null if not an Entity.
 */
export declare const getEntity: <T extends AP.Entity>(entity: undefined | null | AP.EntityReference | AP.EntityReference[]) => T | null;
