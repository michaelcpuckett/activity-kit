import { AP } from 'activitypub-core-types';
import { getId, isType, isTypeOf } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '.';

export async function shouldForwardActivity(this: InboxPostEndpoint) {
  if (!this.activity) {
    return false;
  }

  if (!isTypeOf(this.activity, AP.ActivityTypes)) {
    return false;
  }

  const activity = this.activity as AP.Activity;

  const to = activity.to
    ? Array.isArray(activity.to)
      ? activity.to
      : [activity.to]
    : [];
  const cc = activity.cc
    ? Array.isArray(activity.cc)
      ? activity.cc
      : [activity.cc]
    : [];
  const audience = activity.audience
    ? Array.isArray(activity.audience)
      ? activity.audience
      : [activity.audience]
    : [];

  const addressees = [...to, ...cc, ...audience];

  for (const addressee of addressees) {
    const addresseeId = getId(addressee);

    if (!addresseeId) {
      continue;
    }

    const foundItem = await this.layers.data.findEntityById(addresseeId);

    if (!foundItem) {
      continue;
    }

    if (
      isType(foundItem, AP.CollectionTypes.COLLECTION) ||
      isType(foundItem, AP.CollectionTypes.ORDERED_COLLECTION)
    ) {
      return true;
    }
  }

  const inReplyTo = activity.to
    ? Array.isArray(activity.inReplyTo)
      ? activity.inReplyTo
      : [activity.inReplyTo]
    : [];
  const object =
    'object' in activity && activity.object
      ? Array.isArray(activity.object)
        ? activity.object
        : [activity.object]
      : [];
  const target = activity.target
    ? Array.isArray(activity.target)
      ? activity.target
      : [activity.target]
    : [];
  const tag = activity.tag
    ? Array.isArray(activity.tag)
      ? activity.tag
      : [activity.tag]
    : [];

  const objects = [...inReplyTo, ...object, ...target, ...tag];

  for (const object of objects) {
    const objectId = getId(object);

    if (!objectId) {
      continue;
    }

    const foundItem = await this.layers.data.findEntityById(objectId);

    if (!foundItem) {
      continue;
    }

    if (foundItem) {
      return true;
    }
  }
}
