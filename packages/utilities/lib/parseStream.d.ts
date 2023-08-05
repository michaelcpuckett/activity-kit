/// <reference types="node" />
import type { IncomingMessage } from 'http';
import * as AP from '@activity-kit/types';
/**
 * Parse an HTTP stream into an Entity.
 *
 * @returns The Entity, or null if not found.
 *
 * @todo This is being depricated in favor of having adapters handle this.
 */
export declare function parseStream(req: IncomingMessage): Promise<AP.Entity | null>;
