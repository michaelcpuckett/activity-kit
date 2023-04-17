import { Core } from '.';
import { AP, assertIsApCollection, assertIsArray } from '@activity-kit/types';
import { getId } from '@activity-kit/utilities';

export const getStreamByName = async function (
  this: Core,
  actor: AP.Actor,
  name: string,
): Promise<AP.EitherCollection | null> {
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
};