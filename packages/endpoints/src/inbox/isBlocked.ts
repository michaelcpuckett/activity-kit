import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';
import { InboxPostEndpoint } from '.';

export async function isBlocked(
  this: InboxPostEndpoint,
  actor: AP.Actor,
): Promise<boolean> {
  try {
    assert.isApActivity(this.activity);

    const activityActorId = getId(this.activity.actor);

    assert.exists(activityActorId);

    const activityActor = await this.core.queryById(activityActorId);

    assert.isApActor(activityActor);

    const blocks = await this.core.getStreamByName(actor, 'Blocks');

    assert.isApCollection(blocks);
    assert.isArray(blocks.items);

    const blockedActorIds = await Promise.all(
      blocks.items
        .map(async (item: AP.EntityReference) => {
          const id = getId(item);
          const foundActivity = await this.core.findEntityById(id);
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
