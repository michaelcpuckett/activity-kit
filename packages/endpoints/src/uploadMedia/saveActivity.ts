import {
  AP,
  assertIsApEntity,
  assertIsApExtendedObject,
  assertIsApTransitiveActivity,
} from '@activity-kit/types';
import { LOCAL_DOMAIN, applyContext, getId } from '@activity-kit/utilities';
import { UploadMediaPostEndpoint } from '.';
import { compile } from 'path-to-regexp';

export async function saveActivity(this: UploadMediaPostEndpoint) {
  assertIsApEntity(this.activity);
  assertIsApTransitiveActivity(this.activity);
  assertIsApExtendedObject(this.activity.object);

  const publishedDate = new Date();

  const getRouteUrl = (route: string, data: Record<string, string>) =>
    new URL(
      compile(route, {
        validate: false,
      })(data),
      LOCAL_DOMAIN,
    );

  const entityRoute = `${this.activity.object.id}`;

  const objectRepliesId = getRouteUrl(this.routes.replies, {
    entityRoute,
  });

  const objectReplies = applyContext<AP.Collection>({
    id: objectRepliesId,
    url: objectRepliesId,
    name: 'Replies',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
    published: publishedDate,
  });

  const objectLikesId = getRouteUrl(this.routes.likes, {
    entityRoute,
  });

  const objectLikes = applyContext<AP.OrderedCollection>({
    id: objectLikesId,
    url: objectLikesId,
    name: 'Likes',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  });

  const objectSharesId = getRouteUrl(this.routes.shares, {
    entityRoute,
  });

  const objectShares = applyContext<AP.OrderedCollection>({
    id: objectSharesId,
    url: objectSharesId,
    name: 'Shares',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
    published: publishedDate,
  });

  if (objectLikes.id instanceof URL) {
    this.activity.object.likes = objectLikes.id;
  }

  if (objectShares.id instanceof URL) {
    this.activity.object.shares = objectShares.id;
  }

  if (objectReplies.id instanceof URL) {
    this.activity.object.replies = objectReplies.id;
  }

  this.activity.object.published = publishedDate;

  this.activity.published = publishedDate;

  await Promise.all([
    this.core.saveEntity(objectReplies),
    this.core.saveEntity(objectLikes),
    this.core.saveEntity(objectShares),
    this.core.saveEntity(this.activity.object),
    this.core.saveEntity(this.activity),
    this.core.insertOrderedItem(getId(this.actor?.outbox), this.activity.id),
  ]);
}
