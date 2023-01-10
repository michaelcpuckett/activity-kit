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

    const activityActor = await this.adapters.db.queryById(activityActorId);

    assertIsApActor(activityActor);

    const blocks = await this.adapters.db.getStreamByName(actor, 'Blocks');

    assertIsApCollection(blocks);
    assertIsArray(blocks.items);

    const blockedActorIds = await Promise.all(
      blocks.items.map(async (item: AP.EntityReference) => {
        const id = getId(item);
        const foundActivity = await this.adapters.db.findEntityById(id);
        return getId(foundActivity?.object);
      }),
    );

    return blockedActorIds
      .map((id) => `${id}`)
      .includes(`${activityActorId}`);
  } catch (error) {
    console.log(error);
    return false;
  }
}
