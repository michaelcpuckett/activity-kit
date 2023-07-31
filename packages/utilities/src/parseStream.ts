import type { IncomingMessage } from 'http';
import * as AP from '@activity-kit/types';
import { convertJsonLdToEntity } from './convertJsonLdToEntity';
import { streamToString } from './streamToString';

/**
 * Parse an HTTP stream into an Entity.
 *
 * @returns The Entity, or null if not found.
 *
 * @todo This is being depricated in favor of having adapters handle this.
 */
export async function parseStream(
  req: IncomingMessage,
): Promise<AP.Entity | null> {
  return await convertJsonLdToEntity(JSON.parse(await streamToString(req)));
}
