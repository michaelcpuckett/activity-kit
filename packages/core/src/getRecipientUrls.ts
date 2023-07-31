import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';
import { deduplicateUrls, PUBLIC_ACTOR, getId } from '@activity-kit/utilities';

import { CoreLibrary } from '.';

/**
 * Given an Activity, get the URLs of all recipients.
 *
 * @returns An array of recipient URLs.
 */
export async function getRecipientUrls(
  this: CoreLibrary,
  activity: AP.Activity,
): Promise<URL[]> {
  const tags =
    guard.isApCoreObject(activity.object) && activity.object.tag
      ? getArray(activity.object.tag)
      : [];
  const mentions = tags.map(getId).filter(guard.isUrl);

  const recipients = [
    ...getArray(activity.to),
    ...getArray(activity.cc),
    ...getArray(activity.bto),
    ...getArray(activity.bcc),
    ...getArray(activity.audience),
    ...mentions,
  ].flat();

  const recipientIds = recipients
    .map(getId)
    .filter(guard.isUrl)
    .filter((recipientUrl) => recipientUrl.href !== PUBLIC_ACTOR);

  const actorUrls = await Promise.all(recipientIds.map(getActorIds.bind(this)));

  return deduplicateUrls(actorUrls.flat());
}

/**
 * Given a recipient URL, get all of the Actor URLs that it represents, as it
 * may be a Collection.
 *
 * @returns An array of Actor URLs.
 */
async function getActorIds(
  this: CoreLibrary,
  recipientId: URL,
): Promise<URL[]> {
  const foundRecipient = await this.queryById(recipientId);

  if (!foundRecipient) {
    return [];
  }

  if (guard.isApActor(foundRecipient)) {
    const actorUrl = getId(foundRecipient);

    if (guard.isUrl(actorUrl)) {
      return [actorUrl];
    }
  }

  if (guard.isApCollection(foundRecipient)) {
    const collectionItems = await this.getPaginatedCollectionItems(
      foundRecipient,
    );

    const actorsInCollection: URL[] = [];

    for (const collectionItem of collectionItems) {
      const collectionItemId = getId(collectionItem);

      if (!guard.isUrl(collectionItemId)) {
        continue;
      }

      const expandedCollectionItem = await this.queryById(collectionItemId);

      if (!guard.isApActor(expandedCollectionItem)) {
        continue;
      }

      const actorUrl = getId(expandedCollectionItem);

      if (!guard.isUrl(actorUrl)) {
        continue;
      }

      actorsInCollection.push(actorUrl);
    }

    return actorsInCollection;
  }

  return [];
}

/**
 * Get an array of EntityReferences.
 *
 * Collection items can be either an EntityReference or an array of
 * EntityReferences.
 *
 * @returns An array of EntityReferences.
 */
function getArray(
  items: AP.Collection['items'] | AP.Collection['orderedItems'] | undefined,
): AP.EntityReference[] {
  if (!items) {
    return [];
  }

  const array = guard.isArray(items) ? items : [items];

  return array.filter((item) => {
    return guard.isApEntity(item) || guard.isUrl(item);
  });
}
