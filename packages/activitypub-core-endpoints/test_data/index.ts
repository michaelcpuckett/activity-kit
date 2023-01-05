import { AP } from "activitypub-core-types";
import { LOCAL_DOMAIN } from "activitypub-core-utilities";

export const actor1Id = `${LOCAL_DOMAIN}/entity/actor/1`;
export const actor1ExamplesId = `${actor1Id}/examples`;
export const actor1SharedId = `${actor1Id}/shared`;
export const actor1LikedId = `${actor1Id}/liked`;
export const actor1BlocksId = `${actor1Id}/blocks`;
export const actor1FollowingId = `${actor1Id}/following`;
export const actor1FollowersId = `${actor1Id}/followers`;
export const actor1RequestsId = `${actor1Id}/requests`;
export const actor1: AP.Person = {
  id: new URL(actor1Id),
  url: new URL(actor1Id),
  type: AP.ActorTypes.PERSON,
  inbox: new URL(`${actor1Id}/inbox`),
  outbox: new URL(`${actor1Id}/outbox`),
  following: new URL(actor1FollowingId),
  followers: new URL(actor1FollowersId),
  liked: new URL(actor1LikedId),
  manuallyApprovesFollowers: true,
  streams: [
    new URL(actor1ExamplesId),
    new URL(actor1SharedId),
    new URL(actor1BlocksId),
    new URL(actor1RequestsId),
  ],
};
export const actor1Requests: AP.Collection = {
  id: new URL(actor1RequestsId),
  url: new URL(actor1RequestsId),
  type: AP.CollectionTypes.COLLECTION,
  attributedTo: new URL(actor1Id),
  items: [],
};
export const actor1Followers: AP.Collection = {
  id: new URL(actor1FollowersId),
  url: new URL(actor1FollowersId),
  type: AP.CollectionTypes.COLLECTION,
  attributedTo: new URL(actor1Id),
  items: [],
};
export const example1Id = `${LOCAL_DOMAIN}/entity/example/1`;
export const example1: AP.Document = {
  id: new URL(example1Id),
  url: new URL(example1Id),
  type: AP.ExtendedObjectTypes.DOCUMENT,
  content: '<example>1</example>',
};
export const example2Id = `${LOCAL_DOMAIN}/entity/example/2`;
export const example2: AP.Document = {
  id: new URL(example2Id),
  url: new URL(example2Id),
  type: AP.ExtendedObjectTypes.DOCUMENT,
  content: '<example>2</example>',
};
export const actor1Examples: AP.Collection = {
  id: new URL(actor1ExamplesId),
  url: new URL(actor1ExamplesId),
  type: AP.CollectionTypes.COLLECTION,
  attributedTo: new URL(actor1Id),
  items: [new URL(example1Id)],
};
export const actor1Shared: AP.OrderedCollection = {
  id: new URL(actor1SharedId),
  url: new URL(actor1SharedId),
  type: AP.CollectionTypes.ORDERED_COLLECTION,
  attributedTo: new URL(actor1Id),
  orderedItems: [],
};
export const actor1Following: AP.Collection = {
  id: new URL(actor1FollowingId),
  url: new URL(actor1FollowingId),
  type: AP.CollectionTypes.COLLECTION,
  attributedTo: new URL(actor1Id),
  items: [],
};
export const actor1Liked: AP.OrderedCollection = {
  id: new URL(actor1LikedId),
  url: new URL(actor1LikedId),
  type: AP.CollectionTypes.ORDERED_COLLECTION,
  attributedTo: new URL(actor1Id),
  orderedItems: [],
};
export const actor1Blocks: AP.Collection = {
  id: new URL(actor1BlocksId),
  url: new URL(actor1BlocksId),
  type: AP.CollectionTypes.COLLECTION,
  attributedTo: new URL(actor1Id),
  items: [],
};
export const actor2Id = `${LOCAL_DOMAIN}/entity/actor/2`;
export const actor2RequestsId = `${actor2Id}/requests`;
export const actor2FollowersId = `${actor2Id}/followers`;
export const actor2: AP.Person = {
  id: new URL(actor2Id),
  url: new URL(actor2Id),
  type: AP.ActorTypes.PERSON,
  inbox: new URL(`${actor2Id}/inbox`),
  outbox: new URL(`${actor2Id}/outbox`),
  followers: new URL(actor2FollowersId),
  streams: [new URL(actor2RequestsId)],
};
export const actor2Followers = {
  id: new URL(actor2FollowersId),
  url: new URL(actor2FollowersId),
  type: 'Collection',
  name: 'Followers',
  items: [],
};
export const actor2Requests = {
  id: new URL(actor2RequestsId),
  url: new URL(actor2RequestsId),
  type: 'Collection',
  name: 'Requests',
  items: [],
};
export const note1Id = `${LOCAL_DOMAIN}/entity/note/1`;
export const note1SharesId = `${note1Id}/shares`;
export const note1LikesId = `${note1Id}/likes`;
export const note1RepliesId = `${note1Id}/replies`;
export const note1: AP.Note = {
  id: new URL(note1Id),
  url: new URL(note1Id),
  type: AP.ExtendedObjectTypes.NOTE,
  attributedTo: new URL(actor1Id),
  content: 'Hello world!',
  shares: new URL(note1SharesId),
  likes: new URL(note1LikesId),
  replies: new URL(note1RepliesId),
};
export const note1Shares: AP.Collection = {
  id: new URL(note1SharesId),
  url: new URL(note1SharesId),
  type: AP.CollectionTypes.COLLECTION,
  attributedTo: new URL(actor1Id),
  items: [],
};
export const note1Likes: AP.Collection = {
  id: new URL(note1LikesId),
  url: new URL(note1LikesId),
  type: AP.CollectionTypes.COLLECTION,
  attributedTo: new URL(actor1Id),
  items: [],
};
export const note1Replies: AP.Collection = {
  id: new URL(note1RepliesId),
  url: new URL(note1RepliesId),
  type: AP.CollectionTypes.COLLECTION,
  attributedTo: new URL(actor1Id),
  items: [],
};
export const note2Id = `${LOCAL_DOMAIN}/entity/note/2`;
export const note2: AP.Note = {
  id: new URL(note2Id),
  url: new URL(note2Id),
  type: AP.ExtendedObjectTypes.NOTE,
  attributedTo: new URL(actor1Id),
  content: 'Foo bar!',
  inReplyTo: new URL(note1Id),
};
export const followActivityId = `${LOCAL_DOMAIN}/entity/follow`;
export const followActivity: AP.Follow = {
  id: new URL(followActivityId),
  url: new URL(followActivityId),
  type: AP.ActivityTypes.FOLLOW,
  actor: new URL(actor1Id),
  object: new URL(actor2Id),
};
export const followActivityWithManualApprovalId = `${LOCAL_DOMAIN}/entity/follow/manual`;
export const followActivityWithManualApproval: AP.Follow = {
  id: new URL(followActivityWithManualApprovalId),
  url: new URL(followActivityWithManualApprovalId),
  type: AP.ActivityTypes.FOLLOW,
  actor: new URL(actor2Id),
  object: new URL(actor1Id),
};
export const acceptActivityId = `${LOCAL_DOMAIN}/entity/accept`;
export const acceptActivity: AP.Accept = {
  id: new URL(acceptActivityId),
  url: new URL(acceptActivityId),
  type: AP.ActivityTypes.ACCEPT,
  actor: new URL(actor2Id),
  object: new URL(followActivityId),
};
export const addActivityId = `${LOCAL_DOMAIN}/entity/add`;
export const addActivity: AP.Add = {
  id: new URL(addActivityId),
  url: new URL(addActivityId),
  type: AP.ActivityTypes.ADD,
  actor: new URL(actor1Id),
  target: new URL(actor1ExamplesId),
  object: new URL(example2Id),
};
export const announceActivityId = `${LOCAL_DOMAIN}/entity/announce`;
export const announceActivity: AP.Announce = {
  id: new URL(announceActivityId),
  url: new URL(announceActivityId),
  type: AP.ActivityTypes.ANNOUNCE,
  actor: new URL(actor1Id),
  object: new URL(note1Id),
};
export const blockActivityId = `${LOCAL_DOMAIN}/entity/block`;
export const blockActivity: AP.Block = {
  id: new URL(blockActivityId),
  url: new URL(blockActivityId),
  type: AP.ActivityTypes.BLOCK,
  actor: new URL(actor1Id),
  object: new URL(actor2Id),
};
export const createActivityId = `${LOCAL_DOMAIN}/entity/create`;
export const createActivity: AP.Create = {
  id: new URL(createActivityId),
  url: new URL(createActivityId),
  type: AP.ActivityTypes.CREATE,
  actor: new URL(actor1Id),
  object: {
    type: AP.ExtendedObjectTypes.NOTE,
    content: 'Hello world!',
  },
};
export const createActivityWithObjectId = `${LOCAL_DOMAIN}/entity/create/with-object`;
export const createActivityWithObject: AP.Create = {
  id: new URL(createActivityWithObjectId),
  url: new URL(createActivityWithObjectId),
  type: AP.ActivityTypes.CREATE,
  actor: new URL(actor1Id),
  object: new URL(note2Id),
};
export const deleteActivityId = `${LOCAL_DOMAIN}/entity/delete`;
export const deleteActivity: AP.Delete = {
  id: new URL(deleteActivityId),
  url: new URL(deleteActivityId),
  type: AP.ActivityTypes.DELETE,
  actor: new URL(actor1Id),
  object: new URL(note1Id),
};
export const likeActivityId = `${LOCAL_DOMAIN}/entity/like`;
export const likeActivity: AP.Like = {
  id: new URL(likeActivityId),
  url: new URL(likeActivityId),
  type: AP.ActivityTypes.LIKE,
  actor: new URL(actor1Id),
  object: new URL(note1Id),
};
export const removeActivityId = `${LOCAL_DOMAIN}/entity/remove`;
export const removeActivity: AP.Remove = {
  id: new URL(removeActivityId),
  url: new URL(removeActivityId),
  type: AP.ActivityTypes.REMOVE,
  actor: new URL(actor1Id),
  target: new URL(actor1ExamplesId),
  object: new URL(example1Id),
};
export const updateActivityId = `${LOCAL_DOMAIN}/entity/update`;
export const updateActivity: AP.Update = {
  id: new URL(updateActivityId),
  url: new URL(updateActivityId),
  type: AP.ActivityTypes.UPDATE,
  actor: new URL(actor1Id),
  object: {
    ...note1,
    content: 'Goodbye world!',
  },
};