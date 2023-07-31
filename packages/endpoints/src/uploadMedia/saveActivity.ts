import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { LOCAL_DOMAIN, applyContext, getId } from '@activity-kit/utilities';
import { compile } from 'path-to-regexp';

import { UploadMediaPostEndpoint } from '.';

export async function saveActivity(this: UploadMediaPostEndpoint) {
  assert.isApEntity(this.activity);
  assert.isApTransitiveActivity(this.activity);
  assert.isApExtendedObject(this.activity.object);

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

  const objectReplies = applyContext({
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

  const objectLikes = applyContext({
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

  const objectShares = applyContext({
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
