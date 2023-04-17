import type { IncomingMessage } from 'http';
import { AP } from '@activity-kit/types';
import { convertJsonLdToEntity } from './convertJsonLdToEntity';
import { streamToString } from './streamToString';

export async function parseStream(req: IncomingMessage): Promise<AP.Entity> {
  return await convertJsonLdToEntity(JSON.parse(await streamToString(req)));
}
