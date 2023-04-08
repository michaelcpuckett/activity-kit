import {
  AP,
  assertIsApActor,
  assertIsApEntity,
  assertIsApExtendedObject,
  assertIsApType,
} from 'activitypub-core-types';
import {
  LOCAL_DOMAIN,
  getId,
  isType,
  isTypeOf,
} from 'activitypub-core-utilities';
import { compile } from 'path-to-regexp';
import { OutboxPostEndpoint } from '..';

export async function handleUpdate(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Update>(activity, AP.ActivityTypes.UPDATE);

  const actorId = getId(activity.actor);
  const actor = await this.adapters.db.findEntityById(actorId);

  assertIsApActor(actor);

  if (activity.object instanceof URL) {
    throw new Error(
      'Bad activity: Providing a URL for the object is not sufficient for Update.',
    );
  }

  if (Array.isArray(activity.object)) {
    throw new Error(
      'Internal server error: Object arrays not supported. TODO.',
    );
  }

  if (!isActorAuthorizedToModifyObject(actor, activity)) {
    throw new Error('Not authorized to modify object!');
  }

  const objectId = getId(activity.object);
  const object = await this.adapters.db.findEntityById(objectId);

  assertIsApEntity(object);

  if (isTypeOf(object, AP.ExtendedObjectTypes)) {
    assertIsApExtendedObject(object);
    assertIsApExtendedObject(activity.object);

    if ('tag' in activity.object && Array.isArray(activity.object.tag)) {
      const existingTags = activity.object.tag
        .map((tag) => {
          if (tag instanceof URL) {
            return null;
          }

          return getId(tag)?.toString() ?? null;
        })
        .filter((_) => !!_);

      if (activity.object.tag) {
        const tags = Array.isArray(activity.object.tag)
          ? activity.object.tag
          : [activity.object.tag];

        for (const tag of tags) {
          if (
            !(tag instanceof URL) &&
            isType(tag, AP.ExtendedObjectTypes.HASHTAG)
          ) {
            assertIsApType<AP.Hashtag>(tag, AP.ExtendedObjectTypes.HASHTAG);

            const hashtagCollectionUrl = new URL(
              `${LOCAL_DOMAIN}${compile(this.routes.hashtag)({
                slug: tag.name
                  .replace('#', '')
                  .toLowerCase()
                  .trim() // Remove whitespace from both ends of the string
                  .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
                  .replace(/^-+|-+$/g, ''),
              })}`,
            );

            const hashtagCollection = await this.adapters.db.findEntityById(
              hashtagCollectionUrl,
            );

            if (!hashtagCollection) {
              // TODO: Should type be `AP.Hashtag & AP.Collection`?
              const hashtagEntity: AP.CoreObject = {
                id: hashtagCollectionUrl,
                url: hashtagCollectionUrl,
                name: tag.name,
                type: [
                  AP.ExtendedObjectTypes.HASHTAG,
                  AP.CollectionTypes.ORDERED_COLLECTION,
                ],
                orderedItems: [],
              };

              await this.adapters.db.saveEntity(hashtagEntity);
            }

            if (!existingTags.includes(hashtagCollectionUrl.toString())) {
              await this.adapters.db.insertOrderedItem(
                hashtagCollectionUrl,
                objectId,
              );

              tag.id = hashtagCollectionUrl;
              tag.url = hashtagCollectionUrl;
            }
          }
        }

        const tagIds = tags.map((tag) => {
          if (tag instanceof URL) {
            return tag.toString();
          } else {
            return getId(tag).toString();
          }
        });

        for (const existingTag of existingTags) {
          if (!tagIds.includes(existingTag)) {
            await this.adapters.db.removeOrderedItem(
              new URL(existingTag),
              objectId,
            );
          }
        }

        if (tags.length) {
          activity.object.tag = tags;
        }
      }
    }
  }

  activity.object = {
    ...object,
    ...activity.object,
    ...(object.type !== 'Link' && object.type !== 'Mention'
      ? {
          updated: new Date(),
        }
      : null),
  };

  await this.adapters.db.saveEntity(activity.object);
}

function isActorAuthorizedToModifyObject(
  initiator: AP.Actor,
  activity: AP.Activity,
) {
  const initiatorId = getId(initiator);

  if (!initiatorId) {
    return false;
  }

  if (
    Array.isArray(activity.attributedTo) &&
    activity.attributedTo.find((reference) => {
      const id = getId(reference);
      if (id && id.toString() === initiatorId.toString()) {
        return true;
      }
    })
  ) {
    return true;
  }

  const actorId = getId(activity.actor);
  const attributedTo = getId(activity.attributedTo);

  if (actorId?.toString() === initiatorId.toString()) {
    return true;
  }

  if (attributedTo?.toString() === initiatorId.toString()) {
    return true;
  }
}
