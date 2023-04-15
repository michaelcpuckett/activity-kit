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
    await this.lib.generateKeyPair();

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

  const outboxId = getRouteUrl(this.routes.serverOutbox, {
    entityRoute,
  });

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

  const followersId = getRouteUrl(this.routes.serverFollowers, {
    entityRoute,
  });

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

  const followingId = getRouteUrl(this.routes.serverFollowing, {
    entityRoute,
  });

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

  const hashtagsId = getRouteUrl(this.routes.serverHashtags, {
    entityRoute,
  });

  const botHashtags: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: hashtagsId,
    url: hashtagsId,
    name: 'Hashtags',
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
  };

  await Promise.all([
    this.lib.saveEntity(botActor),
    this.lib.saveEntity(botInbox),
    this.lib.saveEntity(botOutbox),
    this.lib.saveEntity(botFollowing),
    this.lib.saveEntity(botFollowers),
    this.lib.saveEntity(botHashtags),
    this.lib.saveString('username', 'bot', 'bot'),
    this.lib.saveString('privateKey', 'bot', botPrivateKey),
  ]);
}
