"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESERVED_USERNAMES = exports.USERNAME_REGEXP = exports.HTML_CONTENT_TYPE = exports.JSON_CONTENT_TYPE = exports.JRD_CONTENT_TYPE = exports.XRD_CONTENT_TYPE = exports.ACTIVITYSTREAMS_CONTENT_TYPE = exports.ACTIVITYSTREAMS_CONTENT_TYPE_WITH_PROFILE = exports.CONTENT_TYPE_HEADER = exports.ACCEPT_HEADER = exports.SHARED_INBOX_ID = exports.SERVER_ACTOR_ID = exports.SERVER_ACTOR_USERNAME = exports.LINKED_DATA_CONTENT_TYPE = exports.PUBLIC_ACTOR = exports.CHANGESET_CONTEXT = exports.RELATIONSHIP_CONTEXT = exports.W3ID_SECURITY_CONTEXT = exports.ACTIVITYSTREAMS_CONTEXT = exports.CONTEXT = exports.LOCAL_DOMAIN = exports.DB_NAME = exports.PROTOCOL = exports.LOCAL_HOSTNAME = exports.PORT = void 0;
exports.PORT = Number(process.env.AP_PORT ?? 3000);
exports.LOCAL_HOSTNAME = process.env.AP_HOST_NAME ?? 'localhost';
exports.PROTOCOL = process.env.AP_PROTOCOL ?? 'http:';
exports.DB_NAME = process.env.AP_DB_NAME ?? 'activitypub';
exports.LOCAL_DOMAIN = `${exports.PROTOCOL}//${exports.LOCAL_HOSTNAME}${exports.PORT === 80 ? '' : `:${exports.PORT}`}`;
exports.CONTEXT = '@context';
exports.ACTIVITYSTREAMS_CONTEXT = 'https://www.w3.org/ns/activitystreams';
exports.W3ID_SECURITY_CONTEXT = 'https://w3id.org/security/v1';
exports.RELATIONSHIP_CONTEXT = 'http://purl.org/vocab/relationship/';
exports.CHANGESET_CONTEXT = 'http://purl.org/vocab/changeset/schema#';
exports.PUBLIC_ACTOR = `${exports.ACTIVITYSTREAMS_CONTEXT}#Public`;
exports.LINKED_DATA_CONTENT_TYPE = 'application/ld+json';
exports.SERVER_ACTOR_USERNAME = 'bot';
exports.SERVER_ACTOR_ID = `${exports.LOCAL_DOMAIN}/entity/${exports.SERVER_ACTOR_USERNAME}`;
exports.SHARED_INBOX_ID = `${exports.LOCAL_DOMAIN}/sharedInbox`;
exports.ACCEPT_HEADER = 'Accept';
exports.CONTENT_TYPE_HEADER = 'Content-Type';
exports.ACTIVITYSTREAMS_CONTENT_TYPE_WITH_PROFILE = `${exports.LINKED_DATA_CONTENT_TYPE}; profile="${exports.ACTIVITYSTREAMS_CONTEXT}"`;
exports.ACTIVITYSTREAMS_CONTENT_TYPE = 'application/activity+json';
exports.XRD_CONTENT_TYPE = 'application/xrd+xml';
exports.JRD_CONTENT_TYPE = 'application/jrd+json';
exports.JSON_CONTENT_TYPE = 'application/json';
exports.HTML_CONTENT_TYPE = 'text/html';
exports.USERNAME_REGEXP = /^[\w\d]{3,12}$/;
exports.RESERVED_USERNAMES = [
    exports.SERVER_ACTOR_USERNAME,
    'app',
    'test',
    'user',
    'users',
    'account',
    'activity',
    'actor',
    'collection',
    'entity',
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
//# sourceMappingURL=globals.js.map