"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEntityById = void 0;
const globals_1 = require("../globals");
const getTypedEntity_1 = require("../utilities/getTypedEntity");
const convertStringsToUrls_1 = require("../utilities/convertStringsToUrls");
const compressEntity_1 = require("../utilities/compressEntity");
async function fetchEntityById(id) {
    if (typeof this.fetch !== 'function') {
        return null;
    }
    const fetchedThing = await this.fetch(id.toString(), {
        headers: {
            [globals_1.CONTENT_TYPE_HEADER]: globals_1.ACTIVITYSTREAMS_CONTENT_TYPE,
            [globals_1.ACCEPT_HEADER]: globals_1.ACTIVITYSTREAMS_CONTENT_TYPE,
        },
    })
        .then(async (response) => await response.json())
        .catch((error) => {
        console.log(String(error));
        return null;
    });
    if (!(typeof fetchedThing === 'object' &&
        fetchedThing &&
        'type' in fetchedThing)) {
        return null;
    }
    const convertedEntity = (0, convertStringsToUrls_1.convertStringsToUrls)(fetchedThing);
    if (!('type' in convertedEntity) ||
        typeof convertedEntity.type !== 'string') {
        return null;
    }
    const convertedEntityWithType = {
        ...convertedEntity,
        type: convertedEntity.type,
    };
    const typedThing = (0, getTypedEntity_1.getTypedEntity)(convertedEntityWithType);
    if (!typedThing) {
        return null;
    }
    const compressedEntity = (0, compressEntity_1.compressEntity)(typedThing);
    return (0, convertStringsToUrls_1.convertStringsToUrls)(compressedEntity);
}
exports.fetchEntityById = fetchEntityById;
//# sourceMappingURL=fetchEntityById.js.map