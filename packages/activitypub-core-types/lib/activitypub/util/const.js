"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllTypes = exports.CoreObjectTypes = exports.CollectionPageTypes = exports.CollectionTypes = exports.ActivityTypes = exports.IntransitiveActivityTypes = exports.TransitiveActivityTypes = exports.ActorTypes = exports.LinkTypes = exports.ExtendedObjectTypes = void 0;
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
    HASHTAG: 'Hashtag',
};
exports.LinkTypes = {
    LINK: 'Link',
    MENTION: 'Mention',
};
exports.ActorTypes = {
    APPLICATION: 'Application',
    GROUP: 'Group',
    ORGANIZATION: 'Organization',
    PERSON: 'Person',
    SERVICE: 'Service',
};
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
exports.IntransitiveActivityTypes = {
    ARRIVE: 'Arrive',
    TRAVEL: 'Travel',
    QUESTION: 'Question',
};
exports.ActivityTypes = {
    ...exports.TransitiveActivityTypes,
    ...exports.IntransitiveActivityTypes,
};
exports.CollectionTypes = {
    COLLECTION: 'Collection',
    ORDERED_COLLECTION: 'OrderedCollection',
};
exports.CollectionPageTypes = {
    COLLECTION_PAGE: 'CollectionPage',
    ORDERED_COLLECTION_PAGE: 'OrderedCollectionPage',
};
exports.CoreObjectTypes = {
    ...exports.ExtendedObjectTypes,
    ...exports.ActorTypes,
    ...exports.ActivityTypes,
    ...exports.CollectionTypes,
    ...exports.CollectionPageTypes,
};
exports.AllTypes = {
    ...exports.CoreObjectTypes,
    ...exports.LinkTypes,
};
//# sourceMappingURL=const.js.map