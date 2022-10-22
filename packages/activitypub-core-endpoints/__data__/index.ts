import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';

export const aliceUrl = `https://test.com/actor/123`;
export const aliceInboxUrl = `${aliceUrl}/inbox`;
export const aliceOutboxUrl = `${aliceUrl}/outbox`;
export const collection1Url = `${aliceUrl}/collection/abc`;
export const note1Url = `${aliceUrl}/object/123`;

export const alice: AP.Person = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(aliceUrl),
  url: new URL(aliceUrl),
  type: 'Person',
  inbox: new URL(aliceInboxUrl),
  outbox: new URL(aliceOutboxUrl),
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
};
