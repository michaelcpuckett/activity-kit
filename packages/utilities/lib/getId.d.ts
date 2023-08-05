/// <reference types="node" />
import * as AP from '@activity-kit/types';
/**
 * Get the URL from an EntityReference.
 *
 * @returns The URL, or null if not a URL.
 */
export declare const getId: (entity: undefined | null | AP.EntityReference | AP.EntityReference[]) => URL | null;
