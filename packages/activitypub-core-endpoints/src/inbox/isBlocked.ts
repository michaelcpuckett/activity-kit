import {
  AP,
  assertExists,
  assertIsApActivity,
  assertIsApActor,
  assertIsApCollection,
  assertIsArray,
} from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '.';

export async function isBlocked(
  this: InboxPostEndpoint,
  actor: AP.Actor,
): Promise<boolean> {
  try {
    assertIsApActivity(this.activity);

    const activityActorId = getId(this.activity.actor);

    assertExists(activityActorId);

    const activityActor = await this.layers.data.queryById(activityActorId);

    assertIsApActor(activityActor);

    const blocks = await this.layers.data.getStreamByName(actor, 'Blocks');

    assertIsApCollection(blocks);
    assertIsArray(blocks.items);

    const blockedActorIds = await Promise.all(
      blocks.items
        .map(async (item: AP.EntityReference) => {
          const id = getId(item);
          const foundActivity = await this.layers.data.findEntityById(id);
          if (!('object' in foundActivity)) {
            return null;
          }
          return getId(foundActivity.object);
        })
        .filter((id) => !!id),
    );

    return blockedActorIds.map((id) => `${id}`).includes(`${activityActorId}`);
  } catch (error) {
    console.log(error);
    return false;
  }
}
