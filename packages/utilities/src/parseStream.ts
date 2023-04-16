import { IncomingMessage } from 'http';
import { AP } from '@activity-kit/types';
import { convertFromJsonLd } from './convertFromJsonLd';
import { streamToString } from './streamToString';

export async function parseStream(req: IncomingMessage): Promise<AP.Entity> {
  return (await convertFromJsonLd(
    JSON.parse(await streamToString(req)),
  )) as AP.Entity;
}
