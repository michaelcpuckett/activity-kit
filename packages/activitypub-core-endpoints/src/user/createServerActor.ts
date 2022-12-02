import {
  ACTIVITYSTREAMS_CONTEXT,
  SERVER_ACTOR_ID,
  SERVER_ACTOR_USERNAME,
  SHARED_INBOX_ID,
  W3ID_SECURITY_CONTEXT,
} from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import { generateKeyPair } from 'activitypub-core-utilities';
import type { DbAdapter } from 'activitypub-core-types';
import { UserPostEndpoint } from '.';

export async function createServerActor(this: UserPostEndpoint) {
  const { publicKey: botPublicKey, privateKey: botPrivateKey } =
    await generateKeyPair();
  const publishedDate = new Date();

  const botInbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${SERVER_ACTOR_ID}/inbox`),
    url: new URL(`${SERVER_ACTOR_ID}/inbox`),
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(SERVER_ACTOR_ID),
    orderedItems: [],
    published: publishedDate,
  };

  const botOutbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${SERVER_ACTOR_ID}/outbox`),
    url: new URL(`${SERVER_ACTOR_ID}/outbox`),
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: new URL(SERVER_ACTOR_ID),
    orderedItems: [],
    published: publishedDate,
  };

  const botFollowers: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${SERVER_ACTOR_ID}/followers`),
    url: new URL(`${SERVER_ACTOR_ID}/followers`),
    name: 'Followers',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(SERVER_ACTOR_ID),
    items: [],
    published: publishedDate,
  };

  const botFollowing: AP.Collection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${SERVER_ACTOR_ID}/following`),
    url: new URL(`${SERVER_ACTOR_ID}/following`),
    name: 'Following',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: new URL(SERVER_ACTOR_ID),
    items: [],
    published: publishedDate,
  };

  const botActor: AP.Actor = {
    '@context': [
      ACTIVITYSTREAMS_CONTEXT,
      W3ID_SECURITY_CONTEXT,
    ],
    id: new URL(SERVER_ACTOR_ID),
    url: new URL(SERVER_ACTOR_ID),
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
      id: `${SERVER_ACTOR_ID}#main-key`,
      owner: SERVER_ACTOR_ID,
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
    this.adapters.db.saveString('private-key', 'bot', botPrivateKey),
  ]);
}
