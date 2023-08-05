import * as AP from '@activity-kit/types';
/**
 * Removes the private `bto` and `bcc` properties from an {@link AP.Entity}
 * so they don't leak out upon delivery.
 *
 * If the Entity is a {@link AP.TransitiveActivity}, the `object` property will
 * also be cleaned.
 *
 * From the ActivityPub spec:
 *
 * > `bto` and `bcc` already must be removed for delivery, but servers are free
 * > to decide how to represent the object in their own storage systems.
 * > However, since bto and bcc are only intended to be known/seen by the
 * > original author of the object/activity, servers should omit these
 * > properties during display as well.
 *
 * @returns The Entity with the private properties removed.
 *
 * @see https://www.w3.org/TR/activitypub/#security-not-displaying-bto-bcc
 **/
export declare function cleanProps(entity: AP.Entity): AP.Entity;
