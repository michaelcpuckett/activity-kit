import {
  LOCAL_DOMAIN,
  SERVER_ACTOR_USERNAME,
  SHARED_INBOX_ID,
  applyContext,
} from '@activity-kit/utilities';
import * as AP from '@activity-kit/types';
import { UserPostEndpoint } from '.';
import { compile } from 'path-to-regexp';

export async function createServerActor(this: UserPostEndpoint) {
  const { publicKey: botPublicKey, privateKey: botPrivateKey } =
    await this.core.generateKeyPair();

  const publishedDate = new Date();

  const getRouteUrl = (route: string, routeData: Record<string, string>) =>
    new URL(
      `${LOCAL_DOMAIN}${compile(route, {
        validate: false,
      })(routeData)}`,
    );

  const userId = getRouteUrl(this.routes.serverActor, {
    username: SERVER_ACTOR_USERNAME,
  });

  const entityRoute = userId.pathname;

  const inboxId = getRouteUrl(this.routes.serverInbox, {
    entityRoute,
  });

  const botInbox = applyContext<AP.OrderedCollection>({
    id: inboxId,
    url: inboxId,
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  });

  const outboxId = getRouteUrl(this.routes.serverOutbox, {
    entityRoute,
  });

  const botOutbox = applyContext<AP.OrderedCollection>({
    id: outboxId,
    url: outboxId,
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  });

  const followersId = getRouteUrl(this.routes.serverFollowers, {
    entityRoute,
  });

  const botFollowers = applyContext<AP.Collection>({
    id: followersId,
    url: followersId,
    name: 'Followers',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  });

  const followingId = getRouteUrl(this.routes.serverFollowing, {
    entityRoute,
  });

  const botFollowing = applyContext<AP.Collection>({
    id: followingId,
    url: followingId,
    name: 'Following',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  });

  const hashtagsId = getRouteUrl(this.routes.serverHashtags, {
    entityRoute,
  });

  const botHashtags = applyContext<AP.Collection>({
    id: hashtagsId,
    url: hashtagsId,
    name: 'Hashtags',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  });

  const botActor = applyContext<AP.Actor>({
    id: userId,
    url: userId,
    type: AP.ActorTypes.APPLICATION,
    name: SERVER_ACTOR_USERNAME,
    preferredUsername: SERVER_ACTOR_USERNAME,
    inbox: botInbox.id,
    outbox: botOutbox.id,
    following: botFollowing.id,
    followers: botFollowers.id,
    streams: [botHashtags.id],
    endpoints: {
      sharedInbox: new URL(SHARED_INBOX_ID),
    },
    publicKey: {
      id: `${userId}#main-key`,
      owner: `${userId}`,
      publicKeyPem: botPublicKey,
    },
    published: publishedDate,
  });

  await Promise.all([
    this.core.saveEntity(botActor),
    this.core.saveEntity(botInbox),
    this.core.saveEntity(botOutbox),
    this.core.saveEntity(botFollowing),
    this.core.saveEntity(botFollowers),
    this.core.saveEntity(botHashtags),
    this.core.saveString('username', 'bot', 'bot'),
    this.core.saveString('privateKey', 'bot', botPrivateKey),
  ]);
}
