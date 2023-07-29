import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

import { CoreLibrary } from './adapters';

export const getStreamByName = async function (
  this: CoreLibrary,
  actor: AP.Actor,
  name: string,
): Promise<AP.EitherCollection | null> {
  if (!actor.streams) {
    return null;
  }

  const streams = await Promise.all(
    actor.streams.map(async (stream: AP.EntityReference) => {
      const streamId = getId(stream);

      if (!streamId) {
        return null;
      }

      return await this.queryById(streamId);
    }),
  );

  for (const stream of streams) {
    if (guard.isApCollection(stream)) {
      if (stream.name === name) {
        return stream;
      }
    }
  }

  return null;
};
