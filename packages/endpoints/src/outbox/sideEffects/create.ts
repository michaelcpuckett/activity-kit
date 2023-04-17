import { OutboxPostEndpoint } from '..';
import {
  AP,
  assertExists,
  assertIsApActor,
  assertIsApEntity,
  assertIsApExtendedObject,
  assertIsApType,
} from '@activity-kit/types';
import {
  ACTIVITYSTREAMS_CONTEXT,
  SERVER_ACTOR_USERNAME,
  isType,
  isTypeOf,
} from '@activity-kit/utilities';
import { LOCAL_DOMAIN } from '@activity-kit/utilities';
import { getId } from '@activity-kit/utilities';
import { compile } from 'path-to-regexp';
import * as cheerio from 'cheerio';

export async function handleCreate(
  this: OutboxPostEndpoint,
  activity: AP.Entity,
) {
  assertIsApType<AP.Create>(activity, AP.ActivityTypes.CREATE);

  const actorId = getId(activity.actor);

  assertExists(actorId);

  const object = activity.object;

  if (object instanceof URL) {
    throw new Error('Bad object: URL reference is not allowed for Create.');
  }

  if (Array.isArray(object)) {
    throw new Error(
      'Internal error: Object array not supported currently. TODO.',
    );
  }

  assertIsApEntity(object);

  const publishedDate = new Date();

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const [{ value: month }, , { value: day }, , { value: year }] =
    dateFormatter.formatToParts(publishedDate);

  const summary = 'summary' in object ? object.summary ?? '' : '';

  const slug = cheerio
    .load(summary, null, false)
    .text()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of the string
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '');

  const type = Array.isArray(object.type) ? object.type[0] : object.type;

  const objectId = new URL(
    `${LOCAL_DOMAIN}${compile(this.routes[type.toLowerCase()])({
      guid: await this.core.getGuid(),
      year,
      month,
      day,
      slug,
    })}`,
  );

  object.id = objectId;

  if (isTypeOf(object, AP.ExtendedObjectTypes)) {
    assertIsApExtendedObject(object);

    object.url = objectId;

    const entityRoute = objectId.pathname;

    const objectRepliesId = new URL(
      `${LOCAL_DOMAIN}${compile(this.routes.replies, {
        validate: false,
      })({
        entityRoute,
      })}`,
    );

    const objectReplies: AP.OrderedCollection = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: objectRepliesId,
      url: objectRepliesId,
      name: 'Replies',
      type: AP.CollectionTypes.ORDERED_COLLECTION,
      totalItems: 0,
      orderedItems: [],
      published: publishedDate,
      attributedTo: actorId,
    };

    const objectLikesId = new URL(
      `${LOCAL_DOMAIN}${compile(this.routes.likes, {
        validate: false,
      })({
        entityRoute,
      })}`,
    );

    const objectLikes: AP.OrderedCollection = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: objectLikesId,
      url: objectLikesId,
      name: 'Likes',
      type: AP.CollectionTypes.ORDERED_COLLECTION,
      totalItems: 0,
      orderedItems: [],
      published: publishedDate,
      attributedTo: actorId,
    };

    const objectSharesId = new URL(
      `${LOCAL_DOMAIN}${compile(this.routes.shares, {
        validate: false,
      })({
        entityRoute,
      })}`,
    );

    const objectShares: AP.OrderedCollection = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: objectSharesId,
      url: objectSharesId,
      name: 'Shares',
      type: AP.CollectionTypes.ORDERED_COLLECTION,
      totalItems: 0,
      orderedItems: [],
      published: publishedDate,
      attributedTo: actorId,
    };

    object.attributedTo = actorId;
    object.replies = objectRepliesId;
    object.likes = objectLikesId;
    object.shares = objectSharesId;
    object.published = publishedDate;

    if (object.inReplyTo) {
      const objectInReplyTo = await this.core.findEntityById(
        getId(object.inReplyTo),
      );

      if (objectInReplyTo && 'replies' in objectInReplyTo) {
        const repliesCollectionId = getId(objectInReplyTo.replies);

        if (repliesCollectionId) {
          await this.core.insertOrderedItem(repliesCollectionId, objectId);
        }
      }
    }

    if (object.tag) {
      const tags = Array.isArray(object.tag) ? object.tag : [object.tag];

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

          tag.id = hashtagCollectionUrl;
          tag.url = hashtagCollectionUrl;

          const hashtagCollection = await this.core.findEntityById(
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

            await this.core.saveEntity(hashtagEntity);

            const serverActor = await this.core.findOne('entity', {
              preferredUsername: SERVER_ACTOR_USERNAME,
            });

            assertIsApActor(serverActor);

            const serverHashtags = await this.core.getStreamByName(
              serverActor,
              'Hashtags',
            );

            const serverHashtagsUrl = serverHashtags.id;

            await this.core.insertItem(serverHashtagsUrl, hashtagCollectionUrl);
          }

          await this.core.insertOrderedItem(hashtagCollectionUrl, objectId);
        }
      }

      object.tag = tags;
    }

    await Promise.all([
      this.core.saveEntity(object),
      this.core.saveEntity(objectReplies),
      this.core.saveEntity(objectLikes),
      this.core.saveEntity(objectShares),
    ]);
  } else {
    await this.core.saveEntity(object);
  }

  assertIsApType<AP.Create>(this.activity, AP.ActivityTypes.CREATE);

  // Attach the object to the activity that will be saved.
  this.activity.object = object;
}