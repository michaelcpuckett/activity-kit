import {
  ACTIVITYSTREAMS_CONTEXT,
  SERVER_ACTOR_ID,
  SERVER_ACTOR_USERNAME,
  SHARED_INBOX_ID,
} from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import { generateKeyPair } from 'activitypub-core-utilities';
import type { Database } from 'activitypub-core-types';
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
    orderedItems: [],
    published: publishedDate,
  };

  const botOutbox: AP.OrderedCollection = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
    id: new URL(`${SERVER_ACTOR_ID}/outbox`),
    url: new URL(`${SERVER_ACTOR_ID}/outbox`),
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
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
    items: [],
    published: publishedDate,
  };

  const botActor: AP.Actor = {
    '@context': ACTIVITYSTREAMS_CONTEXT,
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
    this.adapters.database.saveEntity(botActor),
    this.adapters.database.saveEntity(botInbox),
    this.adapters.database.saveEntity(botOutbox),
    this.adapters.database.saveEntity(botFollowing),
    this.adapters.database.saveEntity(botFollowers),
    this.adapters.database.saveString('username', 'bot', 'bot'),
    this.adapters.database.saveString('private-key', 'bot', botPrivateKey),
  ]);
}
