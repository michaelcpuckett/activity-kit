import * as jsonld from 'jsonld';
/**
 * The port the server will listen on.
 *
 * Configurable via the `AP_PORT` environment variable.
 *
 * @default 3000
 */
export declare const PORT: number;
/**
 * The server's hostname.
 *
 * Configurable via the `AP_HOST_NAME` environment variable.
 *
 * @default localhost
 */
export declare const LOCAL_HOSTNAME: string;
/**
 * The protocol the server runs on.
 *
 * Configurable via the `AP_PROTOCOL` environment variable.
 *
 * @default http:
 */
export declare const PROTOCOL: string;
/**
 * The database name.
 *
 * Configurable via the `AP_DB_NAME` environment variable.
 *
 * @default activitypub
 */
export declare const DB_NAME: string;
/**
 * The server's domain including protocol and port.
 *
 * @example http://localhost:3000
 * @example https://example.com
 */
export declare const LOCAL_DOMAIN: string;
/**
 * The JSON-LD context property key.
 *
 * @see https://www.w3.org/TR/json-ld11/#the-context
 */
export declare const CONTEXT_KEY = "@context";
/**
 * The JSON-LD context for ActivityPub.
 */
export declare const ACTIVITYSTREAMS_CONTEXT = "https://www.w3.org/ns/activitystreams#";
/**
 * The JSON-LD context for the W3ID security vocabulary.
 *
 * Used for signing and verifying signatures.
 *
 * @see https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.html
 */
export declare const W3ID_SECURITY_CONTEXT = "https://w3id.org/security/v1";
/**
 * The JSON-LD context for the Schema.org vocabulary.
 *
 * @see https://schema.org/
 */
export declare const SCHEMA_ORG_CONTEXT = "https://schema.org/";
/**
 * The JSON-LD context for the Linked Data Platform vocabulary.
 *
 * Some keys are used by ActivityPub, such as `ldp:inbox`.
 *
 * @see https://www.w3.org/TR/ldp/
 */
export declare const LDP_CONTEXT = "http://www.w3.org/ns/ldp#";
/**
 * The JSON-LD context for the Relationship vocabulary.
 *
 * Used to provide additional information about a Relationship, however this
 * is not used by default.
 *
 * @see https://www.w3.org/TR/vocab-relationship/
 */
export declare const RELATIONSHIP_CONTEXT = "http://purl.org/vocab/relationship/";
/**
 * The JSON-LD context for the Changeset vocabulary.
 *
 * Used to provide edit history for an Entity, such as a Note, however this
 * is not used by default.
 *
 * @see https://www.w3.org/TR/2013/REC-vocab-dqv-20130430/
 */
export declare const CHANGESET_CONTEXT = "http://purl.org/vocab/changeset/schema#";
/**
 * The special Actor used to indicate that an Activity is public.
 *
 * @see https://www.w3.org/TR/activitypub/#public-addressing
 */
export declare const PUBLIC_ACTOR: string;
/**
 * The username of the Actor representing the server.
 *
 * This is used primarily for fetching Entities on behalf of the server.
 */
export declare const SERVER_ACTOR_USERNAME = "bot";
/**
 * The URL of the server's Shared Inbox.
 *
 * @see https://www.w3.org/TR/activitypub/#shared-inbox
 */
export declare const SHARED_INBOX_ID: string;
/**
 * The HTTP Header key representing which content type is accepted by
 * the client, such as `application/activity+json`.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
 */
export declare const ACCEPT_HEADER = "Accept";
/**
 * The HTTP Header key representing which content type is being sent by
 * the server, such as `application/activity+json`.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
 */
export declare const CONTENT_TYPE_HEADER = "Content-Type";
/**
 * The HTTP Header value representing the ActivityPub content type.
 *
 * @see https://www.w3.org/TR/activitypub/#retrieving-objects
 */
export declare const LINKED_DATA_CONTENT_TYPE = "application/ld+json";
/**
 * The HTTP Header value representing the ActivityPub content type with
 * the ActivityStreams context.
 *
 * @see https://www.w3.org/TR/activitypub/#retrieving-objects
 */
export declare const ACTIVITYSTREAMS_CONTENT_TYPE_WITH_PROFILE: string;
/**
 * The HTTP Header value representing the ActivityPub content type.
 *
 * @see https://www.w3.org/TR/activitypub/#retrieving-objects
 */
export declare const ACTIVITYSTREAMS_CONTENT_TYPE = "application/activity+json";
/**
 * The HTTP Header value representing the XRD content type.
 *
 * This is used for WebFinger.
 *
 * @see https://tools.ietf.org/html/rfc6415
 */
export declare const XRD_CONTENT_TYPE = "application/xrd+xml";
/**
 * The HTTP Header value representing the JRD content type.
 *
 * This is used for WebFinger.
 *
 * @see https://tools.ietf.org/html/rfc7033
 */
export declare const JRD_CONTENT_TYPE = "application/jrd+json";
/**
 * The HTTP Header value representing the JSON content type.
 *
 * This is often the default content type for HTTP requests.
 */
export declare const JSON_CONTENT_TYPE = "application/json";
/**
 * The HTTP Header value representing the HTML content type.
 */
export declare const HTML_CONTENT_TYPE = "text/html";
/**
 * Regular Expression for a valid username.
 */
export declare const USERNAME_REGEXP: RegExp;
/**
 * The default JSON-LD context for ActivityPub Actors.
 *
 * @see {@link ACTIVITYSTREAMS_CONTEXT}
 * @see {@link W3ID_SECURITY_CONTEXT}
 * @see {@link SCHEMA_ORG_CONTEXT}
 */
export declare const DEFAULT_ACTOR_CONTEXT: (string | {
    schema: string;
})[];
/**
 * The default JSON-LD context for ActivityPub Actors, with instances of URL in
 * place of strings.
 *
export const DEFAULT_ACTOR_CONTEXT_AS_URLS = Object.fromEntries(
  Object.entries(DEFAULT_ACTOR_CONTEXT).map(([key, value]) => [
    key,
    new URL(value),
  ]),
);
*/
/**
 * Express-style route parameters.
 */
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
/**
 * Reserved usernames, which may not be used by Actors because they may
 * conflict with routes.
 */
export declare const RESERVED_USERNAMES: string[];
/**
 * Complete JSON-LD context definitions.
 *
 * Used for compacting JSON-LD objects.
 *
 * @see https://www.w3.org/TR/activitypub/#jsonld-context
 */
export declare const CONTEXT_DEFINITIONS: Record<string, jsonld.ContextDefinition>;
