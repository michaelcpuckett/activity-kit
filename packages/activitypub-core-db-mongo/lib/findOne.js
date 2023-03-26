"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function findOne(collection, matchingObject, options) {
    let value = null;
    if (options && options.includes(activitypub_core_types_1.DbOptions.CASE_INSENSITIVE)) {
        const cursor = this.db
            .collection(collection)
            .find(matchingObject)
            .collation({ locale: 'en', strength: 1 });
        const results = await cursor.toArray();
        if (results.length) {
            value = results[0];
        }
    }
    if (!value) {
        value = await this.db.collection(collection).findOne(matchingObject);
    }
    if (!value) {
        return null;
    }
    delete value._id;
    return (0, activitypub_core_utilities_1.convertStringsToUrls)(value);
}
exports.findOne = findOne;
//# sourceMappingURL=findOne.js.map