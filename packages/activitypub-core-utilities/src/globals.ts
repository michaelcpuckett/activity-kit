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
export const SERVER_ACTOR_ID = `${LOCAL_DOMAIN}/actor/${SERVER_ACTOR_USERNAME}`;
export const SHARED_INBOX_ID = `${LOCAL_DOMAIN}/sharedInbox`;
export const ACCEPT_HEADER = 'Accept';
export const CONTENT_TYPE_HEADER = 'Content-Type';
export const ACTIVITYSTREAMS_CONTENT_TYPE_WITH_PROFILE = `${LINKED_DATA_CONTENT_TYPE}; profile="${ACTIVITYSTREAMS_CONTEXT}"`;
export const ACTIVITYSTREAMS_CONTENT_TYPE = 'application/activity+json';
export const JRD_CONTENT_TYPE = 'application/jrd+json';
export const JSON_CONTENT_TYPE = 'application/json';
export const HTML_CONTENT_TYPE = 'text/html';
export const USERNAME_REGEXP = /^[\w\d]{3,12}$/;
export const RESERVED_USERNAMES = [
  SERVER_ACTOR_USERNAME,
  'app',
  'test',
  'user',
  'users',
  'account',
  'activity',
  'actor',
  'collection',
  'inbox',
  'outbox',
  'replies',
  'likes',
  'shares',
  'liked',
  'shared',
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
];
