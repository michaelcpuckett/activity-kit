"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllTypes = exports.CoreObjectTypes = exports.CollectionPageTypes = exports.CollectionTypes = exports.ActivityTypes = exports.IntransitiveActivityTypes = exports.TransitiveActivityTypes = exports.ActorTypes = exports.LinkTypes = exports.ExtendedObjectTypes = void 0;
/**
 * An object containing all the types of ExtendedObjects.
 *
 * @see ExtendedObject
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#extendedtypes
 */
exports.ExtendedObjectTypes = {
    ARTICLE: 'Article',
    AUDIO: 'Audio',
    DOCUMENT: 'Document',
    EVENT: 'Event',
    IMAGE: 'Image',
    NOTE: 'Note',
    PAGE: 'Page',
    PLACE: 'Place',
    PROFILE: 'Profile',
    RELATIONSHIP: 'Relationship',
    TOMBSTONE: 'Tombstone',
    VIDEO: 'Video',
    HASHTAG: 'Hashtag', // Extension
};
/**
 * An object containing all the types of Links.
 *
 * @see Link
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#links
 */
exports.LinkTypes = {
    LINK: 'Link',
    MENTION: 'Mention',
};
/**
 * An object containing all the types of Actors.
 *
 * @see Actor
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#actors
 */
exports.ActorTypes = {
    APPLICATION: 'Application',
    GROUP: 'Group',
    ORGANIZATION: 'Organization',
    PERSON: 'Person',
    SERVICE: 'Service',
};
/**
 * An object containing all the types of Transitive Activities.
 *
 * @see TransitiveActivity
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#transitive-activity-types
 */
exports.TransitiveActivityTypes = {
    ACCEPT: 'Accept',
    ADD: 'Add',
    ANNOUNCE: 'Announce',
    BLOCK: 'Block',
    IGNORE: 'Ignore',
    CREATE: 'Create',
    DELETE: 'Delete',
    DISLIKE: 'Dislike',
    FLAG: 'Flag',
    FOLLOW: 'Follow',
    INVITE: 'Invite',
    JOIN: 'Join',
    LEAVE: 'Leave',
    LIKE: 'Like',
    LISTEN: 'Listen',
    MOVE: 'Move',
    OFFER: 'Offer',
    READ: 'Read',
    REJECT: 'Reject',
    REMOVE: 'Remove',
    TENTATIVE_ACCEPT: 'TentativeAccept',
    TENTATIVE_REJECT: 'TentativeReject',
    UNDO: 'Undo',
    UPDATE: 'Update',
    VIEW: 'View',
};
/**
 * An object containing all the types of Intransitive Activities.
 *
 * @see IntransitiveActivity
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#intransitive-activity-types
 */
exports.IntransitiveActivityTypes = {
    ARRIVE: 'Arrive',
    TRAVEL: 'Travel',
    QUESTION: 'Question',
};
/**
 * An object containing all the types of Activities.
 *
 * @see Activity
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#activity-types
 */
exports.ActivityTypes = {
    ...exports.TransitiveActivityTypes,
    ...exports.IntransitiveActivityTypes,
};
/**
 * An object containing all the types of Collections.
 *
 * @see Collection
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-collection
 */
exports.CollectionTypes = {
    COLLECTION: 'Collection',
    ORDERED_COLLECTION: 'OrderedCollection',
};
/**
 * An object containing all the types of CollectionPages.
 *
 * @see CollectionPage
 *
 * @see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-collectionpage
 */
exports.CollectionPageTypes = {
    COLLECTION_PAGE: 'CollectionPage',
    ORDERED_COLLECTION_PAGE: 'OrderedCollectionPage',
};
/**
 * An object containing all the types of CoreObjects.
 *
 * @see CoreObject
 *
 * @see https://www.w3.org/TR/activitystreams-core/#object
 */
exports.CoreObjectTypes = {
    ...exports.ExtendedObjectTypes,
    ...exports.ActorTypes,
    ...exports.ActivityTypes,
    ...exports.CollectionTypes,
    ...exports.CollectionPageTypes,
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
exports.AllTypes = {
    ...exports.CoreObjectTypes,
    ...exports.LinkTypes,
};
//# sourceMappingURL=const.js.map