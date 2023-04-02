import {
  ACTIVITYSTREAMS_CONTEXT,
  LOCAL_DOMAIN,
  SERVER_ACTOR_USERNAME,
  SHARED_INBOX_ID,
  W3ID_SECURITY_CONTEXT,
} from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import { UserPostEndpoint } from '.';
import { compile } from 'path-to-regexp';

export async function createServerActor(this: UserPostEndpoint) {
  const { publicKey: botPublicKey, privateKey: botPrivateKey } =
    await this.adapters.crypto.generateKeyPair();

  const publishedDate = new Date();

  const compileOptions = { encode: encodeURIComponent };

  const getRouteUrl = (route: string, data: Record<string, string>) =>
    new URL(`${LOCAL_DOMAIN}${compile(route, compileOptions)(data)}`);

  const userId = getRouteUrl(this.routes.application, {
    username: SERVER_ACTOR_USERNAME,
  });

  const inboxId = new URL(`${userId}/inbox`);

  const botInbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: inboxId,
    url: inboxId,
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  };

  const outboxId = new URL(`${userId}/outbox`);

  const botOutbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: outboxId,
    url: outboxId,
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  };

  const followersId = new URL(`${userId}/followers`);

  const botFollowers: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: followersId,
    url: followersId,
    name: 'Followers',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  };

  const followingId = new URL(`${userId}/following`);

  const botFollowing: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: followingId,
    url: followingId,
    name: 'Following',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  };

  const botActor: AP.Actor = {
    '@context': [ACTIVITYSTREAMS_CONTEXT, W3ID_SECURITY_CONTEXT],
    id: userId,
    url: userId,
    type: AP.ActorTypes.APPLICATION,
    name: SERVER_ACTOR_USERNAME,
    preferredUsername: SERVER_ACTOR_USERNAME,
    inbox: botInbox.id,
    outbox: botOutbox.id,
    following: botFollowing.id,
    followers: botFollowers.id,
    endpoints: {
      sharedInbox: new URL(SHARED_INBOX_ID),
    },
    publicKey: {
      id: `${userId}#main-key`,
      owner: `${userId}`,
      publicKeyPem: botPublicKey,
    },
    published: publishedDate,
  };

  await Promise.all([
    this.adapters.db.saveEntity(botActor),
    this.adapters.db.saveEntity(botInbox),
    this.adapters.db.saveEntity(botOutbox),
    this.adapters.db.saveEntity(botFollowing),
    this.adapters.db.saveEntity(botFollowers),
    this.adapters.db.saveString('username', 'bot', 'bot'),
    this.adapters.db.saveString('privateKey', 'bot', botPrivateKey),
  ]);
}
