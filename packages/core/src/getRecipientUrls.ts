import { Core } from '.';
import {
  AP,
  assertIsApCollection,
  assertIsApActor,
  assertExists,
  assertIsApType,
} from '@activity-kit/types';
import {
  getId,
  PUBLIC_ACTOR,
  deduplicateUrls,
  getArray,
} from '@activity-kit/utilities';

export async function getRecipientUrls(
  this: Core,
  activity: AP.Activity,
): Promise<URL[]> {
  const mentions = (
    'object' in activity && 'tag' in activity.object
      ? getArray<AP.EntityReference>(activity.object.tag)
      : []
  ).filter((entity: AP.EntityReference) => {
    try {
      assertIsApType(entity, AP.LinkTypes.MENTION);
      return true;
    } catch {
      return false;
    }
  });

  const recipients = [
    ...getArray<AP.EntityReference>(activity.to),
    ...getArray<AP.EntityReference>(activity.cc),
    ...getArray<AP.EntityReference>(activity.bto),
    ...getArray<AP.EntityReference>(activity.bcc),
    ...getArray<AP.EntityReference>(activity.audience),
    ...mentions,
  ].flat();

  const recipientIds = recipients
    .map((recipient) => getId(recipient))
    .filter((recipientUrl) => `${recipientUrl}` !== PUBLIC_ACTOR);

  const actorUrls = (
    await Promise.all<URL[]>(
      recipientIds.map(async (recipientId) => {
        const foundRecipient = await this.queryById(recipientId);

        if (!foundRecipient) {
          return [];
        }

        try {
          assertIsApActor(foundRecipient);

          const actorUrl = getId(foundRecipient);

          if (actorUrl instanceof URL) {
            return [actorUrl];
          }
        } catch (error) {
          // Not an Actor.
        }

        try {
          assertIsApCollection(foundRecipient);

          const collectionItems = await this.getPaginatedCollectionItems(
            foundRecipient,
          );

          console.log([collectionItems]);

          const actorsInCollection = [];

          for (const collectionItem of collectionItems) {
            try {
              const collectionItemId = getId(collectionItem);

              assertExists(collectionItemId);

              const expandedCollectionItem = await this.queryById(
                collectionItemId,
              );

              assertIsApActor(expandedCollectionItem);

              const actorUrl = getId(expandedCollectionItem);

              if (actorUrl instanceof URL) {
                actorsInCollection.push(actorUrl);
              }
            } catch (error) {
              // Not an Actor.
            }
          }

          return actorsInCollection;
        } catch (error) {
          // Not a Collection.
        }

        return [];
      }),
    )
  ).flat();

  return deduplicateUrls(actorUrls);
}
