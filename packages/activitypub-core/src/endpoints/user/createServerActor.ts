import {
  SERVER_ACTOR_ID,
  SERVER_ACTOR_USERNAME,
  SHARED_INBOX_ID,
} from '../../globals';
import { AP } from 'activitypub-core-types';
import { generateKeyPair } from '../../utilities/generateKeyPair';
import { DatabaseService } from '../../DatabaseService';

export async function createServerActor(databaseService: DatabaseService) {
  const { publicKey: botPublicKey, privateKey: botPrivateKey } =
    await generateKeyPair();

  const botInbox: AP.OrderedCollection = {
    id: new URL(`${SERVER_ACTOR_ID}/inbox`),
    url: new URL(`${SERVER_ACTOR_ID}/inbox`),
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const botOutbox: AP.OrderedCollection = {
    id: new URL(`${SERVER_ACTOR_ID}/outbox`),
    url: new URL(`${SERVER_ACTOR_ID}/outbox`),
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    orderedItems: [],
  };

  const botFollowers: AP.Collection = {
    id: new URL(`${SERVER_ACTOR_ID}/followers`),
    url: new URL(`${SERVER_ACTOR_ID}/followers`),
    name: 'Followers',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
  };

  const botFollowing: AP.Collection = {
    id: new URL(`${SERVER_ACTOR_ID}/following`),
    url: new URL(`${SERVER_ACTOR_ID}/following`),
    name: 'Following',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    items: [],
  };

  const botActor: AP.Actor = {
    id: new URL(SERVER_ACTOR_ID),
    url: new URL(SERVER_ACTOR_ID),
    type: AP.ActorTypes.APPLICATION,
    name: SERVER_ACTOR_USERNAME,
    preferredUsername: SERVER_ACTOR_USERNAME,
    inbox: botInbox,
    outbox: botOutbox,
    following: botFollowing,
    followers: botFollowers,
    endpoints: {
      sharedInbox: new URL(SHARED_INBOX_ID),
    },
    publicKey: {
      id: `${SERVER_ACTOR_ID}#main-key`,
      owner: SERVER_ACTOR_ID,
      publicKeyPem: botPublicKey,
    },
  };

  await Promise.all([
    databaseService.saveEntity(botActor),
    databaseService.saveEntity(botInbox),
    databaseService.saveEntity(botOutbox),
    databaseService.saveEntity(botFollowing),
    databaseService.saveEntity(botFollowers),
    databaseService.saveString('username', 'bot', 'bot'),
    databaseService.saveString('private-key', 'bot', botPrivateKey),
  ]);
}
