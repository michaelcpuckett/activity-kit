"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = void 0;
const src_1 = require("activitypub-core-types/src");
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
    for (const type of Object.values(src_1.AP.AllTypes)) {
        if (type === entityWithType.type) {
            return entityWithType;
        }
    }
    return null;
}
exports.findOne = findOne;
//# sourceMappingURL=findOne.js.map