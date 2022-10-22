import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';

export const aliceUrl = `https://test.com/actor/alice`;
export const aliceInboxUrl = `${aliceUrl}/inbox`;
export const aliceOutboxUrl = `${aliceUrl}/outbox`;
export const aliceLikedUrl = `${aliceUrl}/liked`;
export const collection1Url = `${aliceUrl}/collection/abc`;
export const note1Url = `${aliceUrl}/object/123`;
export const bobUrl = 'https://test.com/actor/bob';
export const bobInboxUrl = `${bobUrl}/inbox`;
export const bobOutboxUrl = `${bobUrl}/outbox`;
export const note2Url = `${bobUrl}/object/123`;
export const note2LikesUrl = `${note2Url}/likes`;

export const alice: AP.Person = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(aliceUrl),
  url: new URL(aliceUrl),
  type: 'Person',
  inbox: new URL(aliceInboxUrl),
  outbox: new URL(aliceOutboxUrl),
  liked: new URL(aliceLikedUrl),
};

export const aliceLiked: AP.OrderedCollection = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(aliceLikedUrl),
  url: new URL(aliceLikedUrl),
  type: 'OrderedCollection',
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

export const collection1: AP.Collection = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(collection1Url),
  url: new URL(collection1Url),
  type: 'Collection',
  totalItems: 1,
  items: [new URL(aliceUrl)],
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
};

export const note2Likes: AP.OrderedCollection = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(note2LikesUrl),
  url: new URL(note2LikesUrl),
  type: 'OrderedCollection',
  totalItems: 0,
  orderedItems: [],
};