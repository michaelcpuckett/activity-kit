"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanProps = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
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
function cleanProps(entity) {
    const cleanedEntity = { ...entity };
    if ('bto' in cleanedEntity) {
        delete cleanedEntity.bto;
    }
    if ('bcc' in cleanedEntity) {
        delete cleanedEntity.bcc;
    }
    if (type_utilities_1.guard.isApTransitiveActivity(cleanedEntity) &&
        type_utilities_1.guard.isApEntity(cleanedEntity.object)) {
        cleanedEntity.object = cleanProps(cleanedEntity.object);
    }
    return cleanedEntity;
}
exports.cleanProps = cleanProps;
//# sourceMappingURL=cleanProps.js.map