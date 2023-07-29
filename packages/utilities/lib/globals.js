"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESERVED_USERNAMES = exports.DEFAULT_ROUTES = exports.USERNAME_REGEXP = exports.HTML_CONTENT_TYPE = exports.JSON_CONTENT_TYPE = exports.JRD_CONTENT_TYPE = exports.XRD_CONTENT_TYPE = exports.ACTIVITYSTREAMS_CONTENT_TYPE = exports.ACTIVITYSTREAMS_CONTENT_TYPE_WITH_PROFILE = exports.CONTENT_TYPE_HEADER = exports.ACCEPT_HEADER = exports.SHARED_INBOX_ID = exports.SERVER_ACTOR_USERNAME = exports.LINKED_DATA_CONTENT_TYPE = exports.PUBLIC_ACTOR = exports.CHANGESET_CONTEXT = exports.RELATIONSHIP_CONTEXT = exports.LDP_CONTEXT = exports.SCHEMA_ORG_CONTEXT = exports.W3ID_SECURITY_CONTEXT = exports.ACTIVITYSTREAMS_CONTEXT = exports.CONTEXT_KEY = exports.LOCAL_DOMAIN = exports.DB_NAME = exports.PROTOCOL = exports.LOCAL_HOSTNAME = exports.PORT = void 0;
exports.PORT = Number((_a = process.env.AP_PORT) !== null && _a !== void 0 ? _a : 3000);
exports.LOCAL_HOSTNAME = (_b = process.env.AP_HOST_NAME) !== null && _b !== void 0 ? _b : 'localhost';
exports.PROTOCOL = (_c = process.env.AP_PROTOCOL) !== null && _c !== void 0 ? _c : 'http:';
exports.DB_NAME = (_d = process.env.AP_DB_NAME) !== null && _d !== void 0 ? _d : 'activitypub';
exports.LOCAL_DOMAIN = `${exports.PROTOCOL}//${exports.LOCAL_HOSTNAME}${exports.PORT === 80 ? '' : `:${exports.PORT}`}`;
exports.CONTEXT_KEY = '@context';
exports.ACTIVITYSTREAMS_CONTEXT = 'https://www.w3.org/ns/activitystreams';
exports.W3ID_SECURITY_CONTEXT = 'https://w3id.org/security/v1';
exports.SCHEMA_ORG_CONTEXT = 'https://schema.org/';
exports.LDP_CONTEXT = 'http://www.w3.org/ns/ldp#';
exports.RELATIONSHIP_CONTEXT = 'http://purl.org/vocab/relationship/';
exports.CHANGESET_CONTEXT = 'http://purl.org/vocab/changeset/schema#';
exports.PUBLIC_ACTOR = `${exports.ACTIVITYSTREAMS_CONTEXT}Public`;
exports.LINKED_DATA_CONTENT_TYPE = 'application/ld+json';
exports.SERVER_ACTOR_USERNAME = 'bot';
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
exports.DEFAULT_ROUTES = {
    serverActor: '/:username',
    serverInbox: '(.+)?:entityRoute/inbox',
    serverOutbox: '(.+)?:entityRoute/outbox',
    serverFollowers: '(.+)?:entityRoute/followers',
    serverFollowing: '(.+)?:entityRoute/following',
    serverHashtags: '/tag',
    person: '/@:username',
    group: '/group/:username',
    application: '/application/:username',
    service: '/service/:username',
    organization: '/organization/:username',
    article: '/article/:guid',
    event: '/event/:guid',
    note: '/note/:guid',
    page: '/webpage/:guid',
    place: '/place/:guid',
    relationship: '/relationship/:guid',
    profile: '/profile/:guid',
    video: '/video/:guid',
    document: '/document/:guid',
    audio: '/audio/:guid',
    image: '/image/:guid',
    hashtag: '/tag/:slug',
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
    inbox: '(.+)?:entityRoute/inbox',
    outbox: '(.+)?:entityRoute/outbox',
    followers: '(.+)?:entityRoute/followers',
    following: '(.+)?:entityRoute/following',
    liked: '(.+)?:entityRoute/liked',
    stream: '(.+)?:entityRoute/stream/:slug',
    endpoint: '(.+)?:entityRoute/endpoint/:slug',
    likes: '(.+)?:entityRoute/likes',
    shares: '(.+)?:entityRoute/shares',
    replies: '(.+)?:entityRoute/replies',
};
exports.RESERVED_USERNAMES = [
    exports.SERVER_ACTOR_USERNAME,
    ...Object.keys(exports.DEFAULT_ROUTES),
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
//# sourceMappingURL=globals.js.map