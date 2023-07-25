import * as AP from '@activity-kit/types';
import { guard, assert } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

import { InboxPostEndpoint } from '..';

export async function handleAnnounce(
  this: InboxPostEndpoint,
  activity: AP.Announce,
  recipient: AP.Actor,
) {
  try {
    const objectId = getId(activity.object);

    assert.exists(objectId);

    const object = await this.core.findEntityById(objectId);

    assert.isApExtendedObject(object);

    const sharesId = getId(object.shares);

    assert.exists(sharesId);

    const shares = await this.core.findEntityById(sharesId);

    assert.isApCollection(shares);

    const attributedToId = getId(shares.attributedTo);

    assert.exists(attributedToId);

    if (attributedToId.href !== getId(recipient)?.href) {
      // Not applicable to this Actor.
      return;
    }

    const activityId = getId(activity);

    assert.exists(activityId);

    if (
      guard.isApType<AP.OrderedCollection>(
        shares,
        AP.CollectionTypes.ORDERED_COLLECTION,
      )
    ) {
      await this.core.insertOrderedItem(sharesId, activityId);
    } else {
      await this.core.insertItem(sharesId, activityId);
    }
  } catch (error) {
    console.log(error);
  }
}
