"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdate = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function handleUpdate(activity) {
    (0, types_1.assertIsApType)(activity, types_1.AP.ActivityTypes.UPDATE);
    const actorId = (0, utilities_1.getId)(activity.actor);
    const actor = await this.core.findEntityById(actorId);
    (0, types_1.assertIsApActor)(actor);
    if (activity.object instanceof URL) {
        throw new Error('Bad activity: Providing a URL for the object is not sufficient for Update.');
    }
    if (Array.isArray(activity.object)) {
        throw new Error('Internal server error: Object arrays not supported. TODO.');
    }
    if (!isActorAuthorizedToModifyObject(actor, activity)) {
        throw new Error('Not authorized to modify object!');
    }
    const objectId = (0, utilities_1.getId)(activity.object);
    const existingObject = await this.core.findEntityById(objectId);
    (0, types_1.assertIsApEntity)(existingObject);
    const getTags = async () => {
        if (!(0, utilities_1.isTypeOf)(existingObject, types_1.AP.CoreObjectTypes)) {
            return null;
        }
        (0, types_1.assertIsApCoreObject)(existingObject);
        const newObject = {
            type: existingObject.type,
            ...activity.object,
        };
        (0, types_1.assertIsApCoreObject)(newObject);
        if (existingObject.tag || newObject.tag) {
            const existingTags = existingObject.tag
                ? Array.isArray(existingObject.tag)
                    ? existingObject.tag
                    : [existingObject.tag]
                : [];
            const existingTagIds = existingTags
                .map((tag) => {
                if (tag instanceof URL) {
                    return tag.toString();
                }
                return (0, utilities_1.getId)(tag)?.toString() ?? null;
            })
                .filter((_) => !!_);
            const newTags = newObject.tag
                ? Array.isArray(newObject.tag)
                    ? newObject.tag
                    : [newObject.tag]
                : [];
            const getHashtagId = (hashtag) => new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.hashtag)({
                slug: hashtag
                    .replace('#', '')
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, ''),
            })}`);
            const newTagIds = newTags.map((tag) => {
                if (tag instanceof URL) {
                    return tag.toString();
                }
                else {
                    return getHashtagId(tag.name).toString();
                }
            });
            for (const tag of newTags) {
                if (!(tag instanceof URL) &&
                    (0, utilities_1.isType)(tag, types_1.AP.ExtendedObjectTypes.HASHTAG)) {
                    (0, types_1.assertIsApType)(tag, types_1.AP.ExtendedObjectTypes.HASHTAG);
                    const index = newTags.indexOf(tag);
                    const hashtagCollectionUrl = new URL(newTagIds[index]);
                    tag.id = hashtagCollectionUrl;
                    tag.url = hashtagCollectionUrl;
                    const hashtagCollection = await this.core.findEntityById(hashtagCollectionUrl);
                    if (!hashtagCollection) {
                        const hashtagEntity = {
                            id: hashtagCollectionUrl,
                            url: hashtagCollectionUrl,
                            name: tag.name,
                            type: [
                                types_1.AP.ExtendedObjectTypes.HASHTAG,
                                types_1.AP.CollectionTypes.ORDERED_COLLECTION,
                            ],
                            orderedItems: [],
                        };
                        await this.core.saveEntity(hashtagEntity);
                        const serverHashtagsUrl = new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.serverHashtags)({})}`);
                        await this.core.insertItem(serverHashtagsUrl, hashtagCollectionUrl);
                    }
                    if (!existingTagIds.includes(hashtagCollectionUrl.toString())) {
                        await this.core.insertOrderedItem(hashtagCollectionUrl, objectId);
                    }
                }
            }
            for (const existingTagId of existingTagIds) {
                if (!newTagIds.includes(existingTagId)) {
                    await this.core.removeOrderedItem(new URL(existingTagId), objectId);
                }
            }
            return newTags;
        }
    };
    const tags = await getTags();
    activity.object = {
        ...existingObject,
        ...activity.object,
        ...(existingObject.type !== 'Link' && existingObject.type !== 'Mention'
            ? {
                updated: new Date(),
                ...(tags
                    ? {
                        tag: tags,
                    }
                    : null),
            }
            : null),
    };
    await this.core.saveEntity(activity.object);
}
exports.handleUpdate = handleUpdate;
function isActorAuthorizedToModifyObject(initiator, activity) {
    const initiatorId = (0, utilities_1.getId)(initiator);
    if (!initiatorId) {
        return false;
    }
    if (Array.isArray(activity.attributedTo) &&
        activity.attributedTo.find((reference) => {
            const id = (0, utilities_1.getId)(reference);
            if (id && id.toString() === initiatorId.toString()) {
                return true;
            }
        })) {
        return true;
    }
    const actorId = (0, utilities_1.getId)(activity.actor);
    const attributedTo = (0, utilities_1.getId)(activity.attributedTo);
    if (actorId?.toString() === initiatorId.toString()) {
        return true;
    }
    if (attributedTo?.toString() === initiatorId.toString()) {
        return true;
    }
}
//# sourceMappingURL=update.js.map