"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdate = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function handleUpdate(activity) {
    (0, activitypub_core_types_1.assertIsApType)(activity, activitypub_core_types_1.AP.ActivityTypes.UPDATE);
    const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    const actor = await this.adapters.db.findEntityById(actorId);
    (0, activitypub_core_types_1.assertIsApActor)(actor);
    if (activity.object instanceof URL) {
        throw new Error('Bad activity: Providing a URL for the object is not sufficient for Update.');
    }
    if (Array.isArray(activity.object)) {
        throw new Error('Internal server error: Object arrays not supported. TODO.');
    }
    if (!isActorAuthorizedToModifyObject(actor, activity)) {
        throw new Error('Not authorized to modify object!');
    }
    const objectId = (0, activitypub_core_utilities_1.getId)(activity.object);
    const object = await this.adapters.db.findEntityById(objectId);
    (0, activitypub_core_types_1.assertIsApEntity)(object);
    if ((0, activitypub_core_utilities_1.isTypeOf)(object, activitypub_core_types_1.AP.ExtendedObjectTypes)) {
        (0, activitypub_core_types_1.assertIsApExtendedObject)(object);
        if ('tag' in activity.object && Array.isArray(activity.object.tag)) {
            const existingTags = activity.object.tag
                .map((tag) => {
                if (tag instanceof URL) {
                    return null;
                }
                return (0, activitypub_core_utilities_1.getId)(tag)?.toString() ?? null;
            })
                .filter((_) => !!_);
            if (activity.object.tag) {
                const tags = Array.isArray(activity.object.tag)
                    ? activity.object.tag
                    : [activity.object.tag];
                for (const tag of tags) {
                    if (!(tag instanceof URL) &&
                        (0, activitypub_core_utilities_1.isType)(tag, activitypub_core_types_1.AP.ExtendedObjectTypes.HASHTAG)) {
                        (0, activitypub_core_types_1.assertIsApType)(tag, activitypub_core_types_1.AP.ExtendedObjectTypes.HASHTAG);
                        const hashtagCollectionUrl = new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.hashtag)({
                            slug: tag.name
                                .replace('#', '')
                                .toLowerCase()
                                .trim()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/^-+|-+$/g, ''),
                        })}`);
                        const hashtagCollection = await this.adapters.db.findEntityById(hashtagCollectionUrl);
                        if (!hashtagCollection) {
                            const hashtagEntity = {
                                id: hashtagCollectionUrl,
                                url: hashtagCollectionUrl,
                                name: tag.name,
                                type: [
                                    activitypub_core_types_1.AP.ExtendedObjectTypes.HASHTAG,
                                    activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION,
                                ],
                                orderedItems: [],
                            };
                            await this.adapters.db.saveEntity(hashtagEntity);
                        }
                        if (!existingTags.includes(hashtagCollectionUrl.toString())) {
                            await this.adapters.db.insertOrderedItem(hashtagCollectionUrl, objectId);
                            tag.id = hashtagCollectionUrl;
                            tag.url = hashtagCollectionUrl;
                        }
                    }
                }
                const tagIds = tags.map((tag) => {
                    if (tag instanceof URL) {
                        return tag.toString();
                    }
                    else {
                        return (0, activitypub_core_utilities_1.getId)(tag).toString();
                    }
                });
                for (const existingTag of existingTags) {
                    if (!tagIds.includes(existingTag)) {
                        await this.adapters.db.removeOrderedItem(new URL(existingTag), objectId);
                    }
                }
                activity.object.tag = tags;
            }
        }
    }
    activity.object = {
        ...object,
        ...activity.object,
        ...(object.type !== 'Link' && object.type !== 'Mention'
            ? {
                updated: new Date(),
            }
            : null),
    };
    await this.adapters.db.saveEntity(activity.object);
}
exports.handleUpdate = handleUpdate;
function isActorAuthorizedToModifyObject(initiator, activity) {
    const initiatorId = (0, activitypub_core_utilities_1.getId)(initiator);
    if (!initiatorId) {
        return false;
    }
    if (Array.isArray(activity.attributedTo) &&
        activity.attributedTo.find((reference) => {
            const id = (0, activitypub_core_utilities_1.getId)(reference);
            if (id && id.toString() === initiatorId.toString()) {
                return true;
            }
        })) {
        return true;
    }
    const actorId = (0, activitypub_core_utilities_1.getId)(activity.actor);
    const attributedTo = (0, activitypub_core_utilities_1.getId)(activity.attributedTo);
    if (actorId?.toString() === initiatorId.toString()) {
        return true;
    }
    if (attributedTo?.toString() === initiatorId.toString()) {
        return true;
    }
}
//# sourceMappingURL=update.js.map