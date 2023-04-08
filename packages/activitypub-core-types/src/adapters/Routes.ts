export type Routes = {
  serverActor: string;
  serverInbox: string;
  serverOutbox: string;
  serverFollowers: string;
  serverFollowing: string;

  // Actor Types.
  person: string;
  group: string;
  application: string;
  service: string;
  organization: string;

  // Object Types.
  article: string;
  event: string;
  note: string;
  page: string;
  place: string;
  relationship: string;
  profile: string;
  video: string;
  document: string;
  audio: string;
  image: string;
  hashtag: string;

  // Activity Types
  accept: string;
  follow: string;
  delete: string;
  create: string;
  arrive: string;
  add: string;
  offer: string;
  like: string;
  leave: string;
  ignore: string;
  join: string;
  reject: string;
  invite: string;
  tentativeReject: string;
  tentativeAccept: string;
  view: string;
  update: string;
  undo: string;
  remove: string;
  read: string;
  listen: string;
  move: string;
  travel: string;
  announce: string;
  block: string;
  flag: string;
  dislike: string;
  question: string;

  // Actor Collections
  inbox: string;
  outbox: string;
  followers: string;
  following: string;
  liked: string;
  stream: string;
  endpoint: string;

  // Object Collections
  likes: string;
  shares: string;
  replies: string;
};
