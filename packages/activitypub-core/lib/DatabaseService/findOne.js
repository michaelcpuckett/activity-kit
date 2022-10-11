"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const convertStringsToUrls_1 = require("../utilities/convertStringsToUrls");
async function findOne(collection, matchingObject) {
    const value = await this.db.collection(collection).findOne(matchingObject);
    if (!value) {
        return null;
    }
    delete value._id;
    const foundEntity = (0, convertStringsToUrls_1.convertStringsToUrls)(value);
    const entityWithType = {
        ...foundEntity,
        type: foundEntity.type,
    };
    for (const type of Object.values(activitypub_core_types_1.AP.AllTypes)) {
        if (type === entityWithType.type) {
            return entityWithType;
        }
    }
    return null;
}
exports.findOne = findOne;
//# sourceMappingURL=findOne.js.map