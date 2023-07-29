import type { IncomingMessage } from 'http';
import * as AP from '@activity-kit/types';
import { convertJsonLdToEntity } from './convertJsonLdToEntity';
import { streamToString } from './streamToString';

export async function parseStream(
  req: IncomingMessage,
): Promise<AP.Entity | null> {
  return await convertJsonLdToEntity(JSON.parse(await streamToString(req)));
}
