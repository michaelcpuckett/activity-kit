import { Routes } from 'activitypub-core-types';

export const PORT = Number(process.env.AP_PORT ?? 3000);
export const LOCAL_HOSTNAME = process.env.AP_HOST_NAME ?? 'localhost';
export const PROTOCOL = process.env.AP_PROTOCOL ?? 'http:';
export const DB_NAME = process.env.AP_DB_NAME ?? 'activitypub';
export const LOCAL_DOMAIN = `${PROTOCOL}//${LOCAL_HOSTNAME}${
  PORT === 80 ? '' : `:${PORT}`
}`;
export const CONTEXT = '@context';
export const ACTIVITYSTREAMS_CONTEXT = 'https://www.w3.org/ns/activitystreams';
export const W3ID_SECURITY_CONTEXT = 'https://w3id.org/security/v1';
export const RELATIONSHIP_CONTEXT = 'http://purl.org/vocab/relationship/';
export const CHANGESET_CONTEXT = 'http://purl.org/vocab/changeset/schema#';
export const PUBLIC_ACTOR = `${ACTIVITYSTREAMS_CONTEXT}#Public`;
export const LINKED_DATA_CONTENT_TYPE = 'application/ld+json';
export const SERVER_ACTOR_USERNAME = 'bot';
export const SHARED_INBOX_ID = `${LOCAL_DOMAIN}/sharedInbox`;
export const ACCEPT_HEADER = 'Accept';
export const CONTENT_TYPE_HEADER = 'Content-Type';
export const ACTIVITYSTREAMS_CONTENT_TYPE_WITH_PROFILE = `${LINKED_DATA_CONTENT_TYPE}; profile="${ACTIVITYSTREAMS_CONTEXT}"`;
export const ACTIVITYSTREAMS_CONTENT_TYPE = 'application/activity+json';
export const XRD_CONTENT_TYPE = 'application/xrd+xml';
export const JRD_CONTENT_TYPE = 'application/jrd+json';
export const JSON_CONTENT_TYPE = 'application/json';
export const HTML_CONTENT_TYPE = 'text/html';
export const USERNAME_REGEXP = /^[\w\d]{3,12}$/;
export const DEFAULT_ROUTES: Routes = {
  // Server Actor.
  serverActor: '/:username',
  serverInbox: '(.+)?:entityRoute/inbox',
  serverOutbox: '(.+)?:entityRoute/outbox',
  serverFollowers: '(.+)?:entityRoute/followers',
  serverFollowing: '(.+)?:entityRoute/following',

  // Actor Types.
  person: '/@:username',
  group: '/group/:username',
  application: '/application/:username',
  service: '/service/:username',
  organization: '/organization/:username',

  // Object Types.
  article: '/article/:guid',
  event: '/event/:guid',
  note: '/note/:guid', // :slug
  page: '/page/:guid',
  place: '/place/:guid',
  relationship: '/relationship/:guid',
  profile: '/profile/:guid',
  video: '/video/:guid',
  document: '/document/:guid',
  audio: '/audio/:guid',
  image: '/image/:guid',

  // Activity Types
  accept: '/accept/:guid',
  follow: '/follow/:guid',
  delete: '/delete/:guid',
  create: '/create/:guid',
  arrive: '/arrive/:guid',
  add: '/add/:guid',
  offer: '/offer/:guid',
  like: '/like/:guid',
  leave: '/leave/:guid',
  ignore: '/ignore/:guid',
  join: '/join/:guid',
  reject: '/reject/:guid',
  invite: '/invite/:guid',
  tentativeReject: '/tentative-reject/:guid',
  tentativeAccept: '/tentative-accept/:guid',
  view: '/view/:guid',
  update: '/update/:guid',
  undo: '/undo/:guid',
  remove: '/remove/:guid',
  read: '/read/:guid',
  listen: '/listen/:guid',
  move: '/move/:guid',
  travel: '/travel/:guid',
  announce: '/announce/:guid',
  block: '/block/:guid',
  flag: '/flag/:guid',
  dislike: '/dislike/:guid',
  question: '/question/:guid',

  // Actor Collections
  inbox: '(.+)?:entityRoute/inbox',
  outbox: '(.+)?:entityRoute/outbox',
  followers: '(.+)?:entityRoute/followers',
  following: '(.+)?:entityRoute/following',
  liked: '(.+)?:entityRoute/liked',
  stream: '(.+)?:entityRoute/stream/:slug',
  endpoint: '(.+)?:entityRoute/endpoint/:slug',

  // Object Collections
  likes: '(.+)?:entityRoute/likes',
  shares: '(.+)?:entityRoute/shares',
  replies: '(.+)?:entityRoute/replies',
};
export const RESERVED_USERNAMES = [
  SERVER_ACTOR_USERNAME,
  ...Object.keys(DEFAULT_ROUTES),
  'app',
  'test',
  'user',
  'users',
  'account',
  'activity',
  'actor',
  'collection',
  'entity',
  'sharedinbox',
  'shared-inbox',
  'shared_inbox',
  'object',
  '404',
  'error',
  'api',
  'dashboard',
  'home',
  'settings',
  'help',
  'login',
];
