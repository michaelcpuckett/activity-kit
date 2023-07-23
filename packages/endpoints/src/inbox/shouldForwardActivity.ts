import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';
import { getArray, getId } from '@activity-kit/utilities';
import { InboxPostEndpoint } from '.';

// TODO: Check with Spec.

export async function shouldForwardActivity(this: InboxPostEndpoint) {
  if (!this.activity) {
    return false;
  }

  if (!guard.isTypeOf<AP.Activity>(this.activity, AP.ActivityTypes)) {
    return false;
  }

  const activity = this.activity as AP.Activity;

  const to = getArray<AP.EntityReference>(activity.to);
  const cc = getArray<AP.EntityReference>(activity.cc);
  const audience = getArray<AP.EntityReference>(activity.audience);

  const addressees = [...to, ...cc, ...audience];

  for (const addressee of addressees) {
    const addresseeId = getId(addressee);

    if (!addresseeId) {
      continue;
    }

    const foundItem = await this.core.findEntityById(addresseeId);

    if (!foundItem) {
      continue;
    }

    if (
      guard.isType<AP.Collection>(foundItem, AP.CollectionTypes.COLLECTION) ||
      guard.isType<AP.OrderedCollection>(
        foundItem,
        AP.CollectionTypes.ORDERED_COLLECTION,
      )
    ) {
      return true;
    }
  }

  const inReplyTo = getArray<AP.EntityReference>(activity.inReplyTo);
  const object =
    'object' in activity ? getArray<AP.EntityReference>(activity.object) : [];
  const target =
    'target' in activity ? getArray<AP.EntityReference>(activity.target) : [];
  const tag = getArray<AP.EntityReference>(activity.tag);

  const objects = [...inReplyTo, ...object, ...target, ...tag];

  for (const object of objects) {
    const objectId = getId(object);

    if (!objectId) {
      continue;
    }

    const foundItem = await this.core.findEntityById(objectId);

    if (!foundItem) {
      continue;
    }

    if (foundItem) {
      return true;
    }
  }
}
