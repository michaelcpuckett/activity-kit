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

    const activityActor = await this.lib.queryById(activityActorId);

    assertIsApActor(activityActor);

    const blocks = await this.lib.getStreamByName(actor, 'Blocks');

    assertIsApCollection(blocks);
    assertIsArray(blocks.items);

    const blockedActorIds = await Promise.all(
      blocks.items
        .map(async (item: AP.EntityReference) => {
          const id = getId(item);
          const foundActivity = await this.lib.findEntityById(id);
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
