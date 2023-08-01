/**
 * An object containing all the types of ExtendedObjects.
 *
 * @see ExtendedObject
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#extendedtypes
 */
export declare const ExtendedObjectTypes: {
    readonly ARTICLE: "Article";
    readonly AUDIO: "Audio";
    readonly DOCUMENT: "Document";
    readonly EVENT: "Event";
    readonly IMAGE: "Image";
    readonly NOTE: "Note";
    readonly PAGE: "Page";
    readonly PLACE: "Place";
    readonly PROFILE: "Profile";
    readonly RELATIONSHIP: "Relationship";
    readonly TOMBSTONE: "Tombstone";
    readonly VIDEO: "Video";
    readonly HASHTAG: "Hashtag";
};
/**
 * An object containing all the types of Links.
 *
 * @see Link
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#links
 */
export declare const LinkTypes: {
    readonly LINK: "Link";
    readonly MENTION: "Mention";
};
/**
 * An object containing all the types of Actors.
 *
 * @see Actor
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#actors
 */
export declare const ActorTypes: {
    readonly APPLICATION: "Application";
    readonly GROUP: "Group";
    readonly ORGANIZATION: "Organization";
    readonly PERSON: "Person";
    readonly SERVICE: "Service";
};
/**
 * An object containing all the types of Transitive Activities.
 *
 * @see TransitiveActivity
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#transitive-activity-types
 */
export declare const TransitiveActivityTypes: {
    readonly ACCEPT: "Accept";
    readonly ADD: "Add";
    readonly ANNOUNCE: "Announce";
    readonly BLOCK: "Block";
    readonly IGNORE: "Ignore";
    readonly CREATE: "Create";
    readonly DELETE: "Delete";
    readonly DISLIKE: "Dislike";
    readonly FLAG: "Flag";
    readonly FOLLOW: "Follow";
    readonly INVITE: "Invite";
    readonly JOIN: "Join";
    readonly LEAVE: "Leave";
    readonly LIKE: "Like";
    readonly LISTEN: "Listen";
    readonly MOVE: "Move";
    readonly OFFER: "Offer";
    readonly READ: "Read";
    readonly REJECT: "Reject";
    readonly REMOVE: "Remove";
    readonly TENTATIVE_ACCEPT: "TentativeAccept";
    readonly TENTATIVE_REJECT: "TentativeReject";
    readonly UNDO: "Undo";
    readonly UPDATE: "Update";
    readonly VIEW: "View";
};
/**
 * An object containing all the types of Intransitive Activities.
 *
 * @see IntransitiveActivity
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#intransitive-activity-types
 */
export declare const IntransitiveActivityTypes: {
    readonly ARRIVE: "Arrive";
    readonly TRAVEL: "Travel";
    readonly QUESTION: "Question";
};
/**
 * An object containing all the types of Activities.
 *
 * @see Activity
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#activity-types
 */
export declare const ActivityTypes: {
    readonly ARRIVE: "Arrive";
    readonly TRAVEL: "Travel";
    readonly QUESTION: "Question";
    readonly ACCEPT: "Accept";
    readonly ADD: "Add";
    readonly ANNOUNCE: "Announce";
    readonly BLOCK: "Block";
    readonly IGNORE: "Ignore";
    readonly CREATE: "Create";
    readonly DELETE: "Delete";
    readonly DISLIKE: "Dislike";
    readonly FLAG: "Flag";
    readonly FOLLOW: "Follow";
    readonly INVITE: "Invite";
    readonly JOIN: "Join";
    readonly LEAVE: "Leave";
    readonly LIKE: "Like";
    readonly LISTEN: "Listen";
    readonly MOVE: "Move";
    readonly OFFER: "Offer";
    readonly READ: "Read";
    readonly REJECT: "Reject";
    readonly REMOVE: "Remove";
    readonly TENTATIVE_ACCEPT: "TentativeAccept";
    readonly TENTATIVE_REJECT: "TentativeReject";
    readonly UNDO: "Undo";
    readonly UPDATE: "Update";
    readonly VIEW: "View";
};
/**
 * An object containing all the types of Collections.
 *
 * @see Collection
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-collection
 */
export declare const CollectionTypes: {
    readonly COLLECTION: "Collection";
    readonly ORDERED_COLLECTION: "OrderedCollection";
};
/**
 * An object containing all the types of CollectionPages.
 *
 * @see CollectionPage
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-collectionpage
 */
export declare const CollectionPageTypes: {
    readonly COLLECTION_PAGE: "CollectionPage";
    readonly ORDERED_COLLECTION_PAGE: "OrderedCollectionPage";
};
/**
 * An object containing all the types of CoreObjects.
 *
 * @see CoreObject
 *
 * @see https://www.w3.org/TR/activitystreams-core/#object
 */
export declare const CoreObjectTypes: {
    readonly COLLECTION_PAGE: "CollectionPage";
    readonly ORDERED_COLLECTION_PAGE: "OrderedCollectionPage";
    readonly COLLECTION: "Collection";
    readonly ORDERED_COLLECTION: "OrderedCollection";
    readonly ARRIVE: "Arrive";
    readonly TRAVEL: "Travel";
    readonly QUESTION: "Question";
    readonly ACCEPT: "Accept";
    readonly ADD: "Add";
    readonly ANNOUNCE: "Announce";
    readonly BLOCK: "Block";
    readonly IGNORE: "Ignore";
    readonly CREATE: "Create";
    readonly DELETE: "Delete";
    readonly DISLIKE: "Dislike";
    readonly FLAG: "Flag";
    readonly FOLLOW: "Follow";
    readonly INVITE: "Invite";
    readonly JOIN: "Join";
    readonly LEAVE: "Leave";
    readonly LIKE: "Like";
    readonly LISTEN: "Listen";
    readonly MOVE: "Move";
    readonly OFFER: "Offer";
    readonly READ: "Read";
    readonly REJECT: "Reject";
    readonly REMOVE: "Remove";
    readonly TENTATIVE_ACCEPT: "TentativeAccept";
    readonly TENTATIVE_REJECT: "TentativeReject";
    readonly UNDO: "Undo";
    readonly UPDATE: "Update";
    readonly VIEW: "View";
    readonly APPLICATION: "Application";
    readonly GROUP: "Group";
    readonly ORGANIZATION: "Organization";
    readonly PERSON: "Person";
    readonly SERVICE: "Service";
    readonly ARTICLE: "Article";
    readonly AUDIO: "Audio";
    readonly DOCUMENT: "Document";
    readonly EVENT: "Event";
    readonly IMAGE: "Image";
    readonly NOTE: "Note";
    readonly PAGE: "Page";
    readonly PLACE: "Place";
    readonly PROFILE: "Profile";
    readonly RELATIONSHIP: "Relationship";
    readonly TOMBSTONE: "Tombstone";
    readonly VIDEO: "Video";
    readonly HASHTAG: "Hashtag";
};
/**
 * All the types of Entities.
 *
 * @see Entity
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-object
 * @see https://www.w3.org/TR/activitypub/#object
 * @see https://www.w3.org/TR/activitystreams-core/#object
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-link
 * @see https://www.w3.org/TR/activitypub/#link
 * @see https://www.w3.org/TR/activitystreams-core/#link
 */
export declare const AllTypes: {
    readonly LINK: "Link";
    readonly MENTION: "Mention";
    readonly COLLECTION_PAGE: "CollectionPage";
    readonly ORDERED_COLLECTION_PAGE: "OrderedCollectionPage";
    readonly COLLECTION: "Collection";
    readonly ORDERED_COLLECTION: "OrderedCollection";
    readonly ARRIVE: "Arrive";
    readonly TRAVEL: "Travel";
    readonly QUESTION: "Question";
    readonly ACCEPT: "Accept";
    readonly ADD: "Add";
    readonly ANNOUNCE: "Announce";
    readonly BLOCK: "Block";
    readonly IGNORE: "Ignore";
    readonly CREATE: "Create";
    readonly DELETE: "Delete";
    readonly DISLIKE: "Dislike";
    readonly FLAG: "Flag";
    readonly FOLLOW: "Follow";
    readonly INVITE: "Invite";
    readonly JOIN: "Join";
    readonly LEAVE: "Leave";
    readonly LIKE: "Like";
    readonly LISTEN: "Listen";
    readonly MOVE: "Move";
    readonly OFFER: "Offer";
    readonly READ: "Read";
    readonly REJECT: "Reject";
    readonly REMOVE: "Remove";
    readonly TENTATIVE_ACCEPT: "TentativeAccept";
    readonly TENTATIVE_REJECT: "TentativeReject";
    readonly UNDO: "Undo";
    readonly UPDATE: "Update";
    readonly VIEW: "View";
    readonly APPLICATION: "Application";
    readonly GROUP: "Group";
    readonly ORGANIZATION: "Organization";
    readonly PERSON: "Person";
    readonly SERVICE: "Service";
    readonly ARTICLE: "Article";
    readonly AUDIO: "Audio";
    readonly DOCUMENT: "Document";
    readonly EVENT: "Event";
    readonly IMAGE: "Image";
    readonly NOTE: "Note";
    readonly PAGE: "Page";
    readonly PLACE: "Place";
    readonly PROFILE: "Profile";
    readonly RELATIONSHIP: "Relationship";
    readonly TOMBSTONE: "Tombstone";
    readonly VIDEO: "Video";
    readonly HASHTAG: "Hashtag";
};
/**
 * A union of all Entity types.
 */
export type AnyType = (typeof AllTypes)[keyof typeof AllTypes];
/**
 * A type alias representing the provided ActivityPub type or an array of
 * ActivityPub types which includes the provided type.
 *
 * @param T The type to be used. The type must be a valid ActivityPub type.
 *
 * @example
 * ```ts
 * // A single type.
 * const a: TypeOrArrayWithType<'Article'> = 'Article';
 *
 * // An array of types.
 * const b: TypeOrArrayWithType<'Article'> = ['Article', 'Note'];
 * ```
 *
 * @note This type is used to represent the `type` property of an ActivityPub
 * object. The `type` property can be a single type or an array of types.
 *
 * @note Having multiple types in the `type` property is permitted in JSON-LD,
 * however some ActivityPub implementations may not support it. For this reason,
 * it is recommended to only use a single type. Internally, the first type in
 * the array will be used as the primary type.
 *
 * @note Additional non-ActivityPub types may be included in the array, but
 * they will not be validated.
 */
export type TypeOrArrayWithType<T extends AnyType> = T | [T, ...Array<AnyType>];
