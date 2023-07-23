import { Core } from '.';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export const getStreamByName = async function (
  this: Core,
  actor: AP.Actor,
  name: string,
): Promise<AP.EitherCollection | null> {
  assert.isArray(actor.streams);

  const streams = await Promise.all(
    actor.streams.map(async (stream: AP.Entity | URL) => {
      const streamId = getId(stream);

      if (!streamId) {
        return null;
      }

      return await this.queryById(streamId);
    }),
  );

  for (const stream of streams) {
    try {
      assert.isApCollection(stream);

      if (stream.name === name) {
        return stream;
      }
    } catch (error) {
      break;
    }
  }

  return null;
};
