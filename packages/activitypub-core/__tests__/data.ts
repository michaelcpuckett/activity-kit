import { AP } from 'activitypub-core-types';
import { ACTIVITYSTREAMS_CONTEXT } from '../src/globals';

export const actor1Url = `https://test.com/actor/123`;
export const actor1InboxUrl = `${actor1Url}/inbox`;
export const actor1OutboxUrl = `${actor1Url}/outbox`;
export const actor1FollowersUrl = `${actor1Url}/followers`;
export const actor1FollowingUrl = `${actor1Url}/following`;
export const collection1Url = `${actor1Url}/collection/abc`;
export const collection2Url = `${actor1Url}/collection/def`;
export const note1Url = `${actor1Url}/object/123`;
export const note2Url = `${actor1Url}/object/345`;
export const note2LikesUrl = `${actor1Url}/object/345/likes`;
export const note2SharesUrl = `${actor1Url}/object/345/shares`;
export const actor2Url = `https://test.com/actor/987`;
export const actor2InboxUrl = `${actor2Url}/inbox`;
export const actor2OutboxUrl = `${actor2Url}/outbox`;
export const actor2FollowersUrl = `${actor2Url}/followers`;
export const actor2FollowingUrl = `${actor2Url}/following`;
export const actor3Url = `https://test.com/actor/654`;
export const actor3InboxUrl = `${actor3Url}/inbox`;
export const actor3OutboxUrl = `${actor3Url}/outbox`;
export const actor4Url = `https://test.com/actor/321`;
export const actor4InboxUrl = `${actor4Url}/inbox`;
export const actor4OutboxUrl = `${actor4Url}/outbox`;
export const sharedInboxUrl = `https://test.com/sharedInbox`;
export const actor5Url = `https://test.com/actor/001`;
export const actor5InboxUrl = `${actor5Url}/inbox`;
export const actor5OutboxUrl = `${actor5Url}/outbox`;

export const remoteCollection1Url = `http://2.example.com/123/456`;
export const originalAddActivityId = `https://test.com/activity/abc`;
export const originalRemoveActivityId = `https://test.com/activity/def`;
export const originalLikeActivityId = 'https://test.com/activity/ghi';
export const originalAnnounceActivityId = 'https://test.com/activity/jkl';
export const originalCreateActivityId = 'https://test.com/activity/mno';
export const originalDeleteActivityId = 'https://test.com/activity/pqr';
export const originalFollowActivityId = 'https://test.com/activity/stu';

export const originalFollowActivity: AP.Follow = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(originalFollowActivityId),
  url: new URL(originalFollowActivityId),
  type: 'Follow',
  actor: new URL(actor2Url),
  object: new URL(actor1Url),
};

export const originalAddActivity: AP.Add = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(originalAddActivityId),
  url: new URL(originalAddActivityId),
  type: 'Add',
  actor: new URL(actor1Url),
  object: new URL(note1Url),
  target: new URL(collection1Url),
};

export const originalRemoveActivity: AP.Remove = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(originalRemoveActivityId),
  url: new URL(originalRemoveActivityId),
  type: 'Remove',
  actor: new URL(actor1Url),
  object: new URL(note1Url),
  target: new URL(collection1Url),
};

export const originalLikeActivity: AP.Like = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(originalLikeActivityId),
  url: new URL(originalLikeActivityId),
  type: 'Like',
  actor: new URL(actor1Url),
  object: new URL(note2Url),
};

export const originalAnnounceActivity: AP.Announce = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(originalAnnounceActivityId),
  url: new URL(originalAnnounceActivityId),
  type: 'Announce',
  actor: new URL(actor1Url),
  object: new URL(note2Url),
};

export const originalCreateActivity: AP.Create = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(originalCreateActivityId),
  url: new URL(originalCreateActivityId),
  type: 'Create',
  actor: new URL(actor1Url),
  object: new URL(note1Url),
};

export const originalDeleteActivity: AP.Delete = {
  '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(originalDeleteActivityId),
  url: new URL(originalDeleteActivityId),
  type: 'Delete',
  actor: new URL(actor1Url),
  object: new URL(note1Url),
};

export const actor1Result: AP.Person = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor1Url),
  url: new URL(actor1Url),
  type: 'Person',
  inbox: new URL(actor1InboxUrl),
  outbox: new URL(actor1OutboxUrl),
  following: new URL(actor1FollowingUrl),
  followers: new URL(actor1FollowersUrl),
  liked: new URL(actor1LikedUrl),
  streams: [new URL(actor1SharedUrl)],
};

export const actor1Inbox: AP.OrderedCollection = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor1InboxUrl),
  url: new URL(actor1InboxUrl),
  type: 'OrderedCollection',
  totalItems: 0,
  orderedItems: [],
};

export const actor1Outbox: AP.OrderedCollection = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor1OutboxUrl),
  url: new URL(actor1OutboxUrl),
  type: 'OrderedCollection',
  totalItems: 0,
  orderedItems: [],
};

export const actor1Following: AP.Collection = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor1FollowingUrl),
  url: new URL(actor1FollowingUrl),
  type: 'Collection',
  totalItems: 0,
  items: [],
};

export const actor1Followers: AP.Collection = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor1FollowingUrl),
  url: new URL(actor1FollowingUrl),
  type: 'Collection',
  totalItems: 0,
  items: [],
};

export const actor2Result: AP.Person = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor2Url),
  url: new URL(actor2Url),
  type: 'Person',
  inbox: new URL(actor2InboxUrl),
  outbox: new URL(actor2OutboxUrl),
  following: new URL(actor2FollowingUrl),
  followers: new URL(actor2FollowersUrl),
};

export const actor2Inbox: AP.OrderedCollection = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor2InboxUrl),
  url: new URL(actor2InboxUrl),
  type: 'OrderedCollection',
  totalItems: 0,
  orderedItems: [],
};

export const actor2Outbox: AP.OrderedCollection = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor2OutboxUrl),
  url: new URL(actor2OutboxUrl),
  type: 'OrderedCollection',
  totalItems: 0,
  orderedItems: [],
};

export const actor2Following: AP.Collection = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor2FollowingUrl),
  url: new URL(actor2FollowingUrl),
  type: 'Collection',
  totalItems: 0,
  items: [],
};

export const actor2Followers: AP.Collection = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor2FollowingUrl),
  url: new URL(actor2FollowingUrl),
  type: 'Collection',
  totalItems: 0,
  items: [],
};

export const actor3Result: AP.Person = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor3Url),
  url: new URL(actor3Url),
  type: 'Person',
  inbox: new URL(actor3InboxUrl),
  outbox: new URL(actor3OutboxUrl),
};

export const actor5Result: AP.Person = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor5Url),
  url: new URL(actor5Url),
  type: 'Person',
  inbox: new URL(actor5InboxUrl),
  outbox: new URL(actor5OutboxUrl),
  endpoints: {
    sharedInbox: new URL(sharedInboxUrl),
  },
};

export const actor3Inbox: AP.OrderedCollection = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor3InboxUrl),
  url: new URL(actor3InboxUrl),
  type: 'OrderedCollection',
  totalItems: 0,
  orderedItems: [],
};

export const actor3Outbox: AP.OrderedCollection = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor3OutboxUrl),
  url: new URL(actor3OutboxUrl),
  type: 'OrderedCollection',
  totalItems: 0,
  orderedItems: [],
};

export const actor4Result: AP.Person = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor4Url),
  url: new URL(actor4Url),
  type: 'Person',
  inbox: new URL(actor4InboxUrl),
  outbox: new URL(actor4OutboxUrl),
  endpoints: {
    sharedInbox: new URL(sharedInboxUrl),
  },
};

export const actor1Shared: AP.OrderedCollection = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor1SharedUrl),
  url: new URL(actor1SharedUrl),
  name: 'Shared',
  type: 'OrderedCollection',
  totalItems: 0,
  orderedItems: [],
};

export const actor1Liked: AP.OrderedCollection = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(actor1LikedUrl),
  url: new URL(actor1LikedUrl),
  name: 'Liked',
  type: 'OrderedCollection',
  totalItems: 0,
  orderedItems: [],
};

export const collection1: AP.Collection = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(collection1Url),
  url: new URL(collection1Url),
  type: 'Collection',
  totalItems: 1,
  items: [new URL(actor3Url)],
};

export const collection2: AP.Collection = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(collection1Url),
  url: new URL(collection1Url),
  type: 'Collection',
  totalItems: 0,
  items: [new URL(note1Url)],
};

export const note1 = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(note1Url),
  url: new URL(note1Url),
  type: 'Note',
  content: 'Hello world',
};

export const note2 = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(note2Url),
  url: new URL(note2Url),
  type: 'Note',
  content: 'Foo bar',
  attributedTo: new URL(actor1Url),
  shares: new URL(note2SharesUrl),
  likes: new URL(note2LikesUrl),
};

export const note2Likes = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(note2LikesUrl),
  url: new URL(note2LikesUrl),
  type: 'OrderedCollection',
  totalItems: 0,
  orderedItems: [],
};

export const note2Shares = {
  "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
  id: new URL(note2SharesUrl),
  url: new URL(note2SharesUrl),
  type: 'OrderedCollection',
  totalItems: 0,
  orderedItems: [],
};

describe('data', () => {
  it('works', () => {
    expect(actor1Result).toBeTruthy();
  });
});
