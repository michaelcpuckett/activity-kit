import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';

export const aliceUrl = `https://test.com/entity/alice`;
export const aliceInboxUrl = `${aliceUrl}/inbox`;
export const aliceOutboxUrl = `${aliceUrl}/outbox`;
export const aliceLikedUrl = `${aliceUrl}/liked`;
export const aliceSharedUrl = `${aliceUrl}/shared`;
export const collection1Url = `${aliceUrl}/collection/abc`;
export const note1Url = `${aliceUrl}/entity/123`;
export const bobUrl = 'https://test.com/entity/bob';
export const bobInboxUrl = `${bobUrl}/inbox`;
export const bobOutboxUrl = `${bobUrl}/outbox`;
export const eveUrl = 'https://test.com/entity/eve';
export const eveInboxUrl = `${eveUrl}/inbox`;
export const eveOutboxUrl = `${eveUrl}/outbox`;
export const note2Url = `${bobUrl}/entity/123`;
export const note2LikesUrl = `${note2Url}/likes`;
export const note2SharesUrl = `${note2Url}/shares`;
export const addActivityUrl = `${aliceUrl}/add/abc`;
export const removeActivityUrl = `${aliceUrl}/remove/abc`;
export const createActivityUrl = `${aliceUrl}/create/abc`;
export const likeActivityUrl = `${aliceUrl}/like/abc`;
export const announceActivityUrl = `${aliceUrl}/announce/abc`;

export const alice: AP.Person = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(aliceUrl),
  url: new URL(aliceUrl),
  type: 'Person',
  inbox: new URL(aliceInboxUrl),
  outbox: new URL(aliceOutboxUrl),
  liked: new URL(aliceLikedUrl),
  streams: [new URL(aliceSharedUrl)],
};

export const aliceLiked: AP.OrderedCollection = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(aliceLikedUrl),
  url: new URL(aliceLikedUrl),
  type: 'OrderedCollection',
  totalItems: 0,
  orderedItems: [],
};

export const aliceShared: AP.OrderedCollection = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(aliceSharedUrl),
  url: new URL(aliceSharedUrl),
  type: 'OrderedCollection',
  name: 'Shared',
  totalItems: 0,
  orderedItems: [],
};

export const bob: AP.Person = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(bobUrl),
  url: new URL(bobUrl),
  type: 'Person',
  inbox: new URL(bobInboxUrl),
  outbox: new URL(bobOutboxUrl),
};

export const eve: AP.Person = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(eveUrl),
  url: new URL(eveUrl),
  type: 'Person',
  inbox: new URL(eveInboxUrl),
  outbox: new URL(eveOutboxUrl),
};

export const collection1: AP.Collection = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(collection1Url),
  url: new URL(collection1Url),
  type: 'Collection',
  totalItems: 1,
  items: [new URL(note1Url)],
};

export const note1 = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(note1Url),
  url: new URL(note1Url),
  type: 'Note',
  content: 'Hello world',
  attributedTo: new URL(aliceUrl),
};

export const note2 = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(note2Url),
  url: new URL(note2Url),
  type: 'Note',
  content: 'Foo Bar',
  attributedTo: new URL(bobUrl),
  likes: new URL(note2LikesUrl),
  shares: new URL(note2SharesUrl),
};

export const note2Likes: AP.OrderedCollection = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(note2LikesUrl),
  url: new URL(note2LikesUrl),
  type: 'OrderedCollection',
  totalItems: 0,
  orderedItems: [],
};

export const note2Shares: AP.OrderedCollection = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(note2SharesUrl),
  url: new URL(note2SharesUrl),
  type: 'OrderedCollection',
  totalItems: 0,
  orderedItems: [],
};

export const addActivity: AP.Add = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(addActivityUrl),
  url: new URL(addActivityUrl),
  type: 'Add',
  actor: new URL(aliceUrl),
  object: new URL(note1Url),
  target: new URL(collection1Url),
};

export const removeActivity: AP.Remove = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(removeActivityUrl),
  url: new URL(removeActivityUrl),
  type: 'Remove',
  actor: new URL(aliceUrl),
  object: new URL(note1Url),
  target: new URL(collection1Url),
};

export const createActivity: AP.Create = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(createActivityUrl),
  url: new URL(createActivityUrl),
  type: 'Create',
  actor: new URL(aliceUrl),
  object: new URL(note1Url),
};

export const likeActivity: AP.Like = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(likeActivityUrl),
  url: new URL(likeActivityUrl),
  type: 'Like',
  actor: new URL(aliceUrl),
  object: new URL(note2Url),
};

export const announceActivity: AP.Announce = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(announceActivityUrl),
  url: new URL(announceActivityUrl),
  type: 'Announce',
  actor: new URL(aliceUrl),
  object: new URL(note2Url),
};
