export const ExtendedObjectTypes = {
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
} as const;

export const LinkTypes = {
  LINK: 'Link',
  MENTION: 'Mention',
} as const;

export const ActorTypes = {
  APPLICATION: 'Application',
  GROUP: 'Group',
  ORGANIZATION: 'Organization',
  PERSON: 'Person',
  SERVICE: 'Service',
} as const;

export const TransitiveActivityTypes = {
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
} as const;

export const IntransitiveActivityTypes = {
  ARRIVE: 'Arrive',
  TRAVEL: 'Travel',
  QUESTION: 'Question',
} as const;

export const ActivityTypes = {
  ...TransitiveActivityTypes,
  ...IntransitiveActivityTypes,
} as const;

export const CollectionTypes = {
  COLLECTION: 'Collection',
  ORDERED_COLLECTION: 'OrderedCollection',
} as const;

export const CollectionPageTypes = {
  COLLECTION_PAGE: 'CollectionPage',
  ORDERED_COLLECTION_PAGE: 'OrderedCollectionPage',
} as const;

export const CoreObjectTypes = {
  ...ExtendedObjectTypes,
  ...ActorTypes,
  ...ActivityTypes,
  ...CollectionTypes,
  ...CollectionPageTypes,
} as const;

export const AllTypes = {
  ...CoreObjectTypes,
  ...LinkTypes,
} as const;

export type AnyType = (typeof AllTypes)[keyof typeof AllTypes];

export type TypeOrArrayWithType<T extends AnyType> = T | [T, ...Array<AnyType>];
