export declare const PORT: number;
export declare const LOCAL_HOSTNAME: string;
export declare const PROTOCOL: string;
export declare const DB_NAME: string;
export declare const LOCAL_DOMAIN: string;
export declare const CONTEXT_KEY = "@context";
export declare const ACTIVITYSTREAMS_CONTEXT = "https://www.w3.org/ns/activitystreams";
export declare const W3ID_SECURITY_CONTEXT = "https://w3id.org/security/v1";
export declare const SCHEMA_ORG_CONTEXT = "https://schema.org/";
export declare const LDP_CONTEXT = "http://www.w3.org/ns/ldp#";
export declare const RELATIONSHIP_CONTEXT = "http://purl.org/vocab/relationship/";
export declare const CHANGESET_CONTEXT = "http://purl.org/vocab/changeset/schema#";
export declare const PUBLIC_ACTOR: string;
export declare const LINKED_DATA_CONTENT_TYPE = "application/ld+json";
export declare const SERVER_ACTOR_USERNAME = "bot";
export declare const SHARED_INBOX_ID: string;
export declare const ACCEPT_HEADER = "Accept";
export declare const CONTENT_TYPE_HEADER = "Content-Type";
export declare const ACTIVITYSTREAMS_CONTENT_TYPE_WITH_PROFILE: string;
export declare const ACTIVITYSTREAMS_CONTENT_TYPE = "application/activity+json";
export declare const XRD_CONTENT_TYPE = "application/xrd+xml";
export declare const JRD_CONTENT_TYPE = "application/jrd+json";
export declare const JSON_CONTENT_TYPE = "application/json";
export declare const HTML_CONTENT_TYPE = "text/html";
export declare const USERNAME_REGEXP: RegExp;
export declare const DEFAULT_ROUTES: {
    serverActor: string;
    serverInbox: string;
    serverOutbox: string;
    serverFollowers: string;
    serverFollowing: string;
    serverHashtags: string;
    person: string;
    group: string;
    application: string;
    service: string;
    organization: string;
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
    inbox: string;
    outbox: string;
    followers: string;
    following: string;
    liked: string;
    stream: string;
    endpoint: string;
    likes: string;
    shares: string;
    replies: string;
};
export declare const RESERVED_USERNAMES: string[];
