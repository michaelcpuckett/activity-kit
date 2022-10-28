"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEntityById = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const activitypub_core_utilities_4 = require("activitypub-core-utilities");
async function fetchEntityById(id) {
    if (typeof this.fetch !== 'function') {
        return null;
    }
    const fetchedThing = await this.fetch(id.toString(), {
        headers: {
            [activitypub_core_utilities_1.CONTENT_TYPE_HEADER]: activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
            [activitypub_core_utilities_1.ACCEPT_HEADER]: activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
        },
    })
        .then(async (response) => {
        return await response.json();
    })
        .catch((error) => {
        console.log(String(error));
        return null;
    });
    if (!(typeof fetchedThing === 'object' &&
        fetchedThing &&
        'type' in fetchedThing)) {
        return null;
    }
    const convertedEntity = (0, activitypub_core_utilities_3.convertStringsToUrls)(fetchedThing);
    if (!('type' in convertedEntity) ||
        typeof convertedEntity.type !== 'string') {
        return null;
    }
    const convertedEntityWithType = {
        ...convertedEntity,
        type: convertedEntity.type,
    };
    const typedThing = (0, activitypub_core_utilities_2.getTypedEntity)(convertedEntityWithType);
    if (!typedThing) {
        return null;
    }
    const compressedEntity = (0, activitypub_core_utilities_4.compressEntity)(typedThing);
    return compressedEntity;
}
exports.fetchEntityById = fetchEntityById;
//# sourceMappingURL=fetchEntityById.js.map