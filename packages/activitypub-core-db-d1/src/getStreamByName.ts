import { D1DbAdapter } from '.';
import {
  AP,
  assertIsApCollection,
  assertIsArray,
} from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';

export async function getStreamByName(
  this: D1DbAdapter,
  actor: AP.Actor,
  name: string,
): Promise<AP.Collection | AP.OrderedCollection | null> {
  assertIsArray(actor.streams);

  const streams = await Promise.all(
    actor.streams.map(async (stream: AP.Entity | URL) => {
      const streamId = getId(stream);

      if (!streamId) {
        return null;
      }

      return await this.findEntityById(streamId);
    }),
  );

  for (const stream of streams) {
    try {
      assertIsApCollection(stream);

      if (stream.name === name) {
        return stream;
      }
    } catch (error) {
      break;
    }
  }

  return null;
}
