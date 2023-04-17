import { AP, isType, isTypeOf } from '@activity-kit/types';
import { getArray, getId } from '@activity-kit/utilities';
import { InboxPostEndpoint } from '.';

// TODO: Check with Spec.

export async function shouldForwardActivity(this: InboxPostEndpoint) {
  if (!this.activity) {
    return false;
  }

  if (!isTypeOf<AP.Activity>(this.activity, AP.ActivityTypes)) {
    return false;
  }

  const activity = this.activity as AP.Activity;

  const to = getArray(activity.to);
  const cc = getArray(activity.cc);
  const audience = getArray(activity.audience);

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
      isType<AP.Collection>(foundItem, AP.CollectionTypes.COLLECTION) ||
      isType<AP.OrderedCollection>(
        foundItem,
        AP.CollectionTypes.ORDERED_COLLECTION,
      )
    ) {
      return true;
    }
  }

  const inReplyTo = getArray(activity.inReplyTo);
  const object = 'object' in activity ? getArray(activity.object) : [];
  const target = 'target' in activity ? getArray(activity.target) : [];
  const tag = getArray(activity.tag);

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
