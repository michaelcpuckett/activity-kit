"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function findOne(collection, matchingObject) {
    const value = await this.db.collection(collection).findOne(matchingObject);
    if (!value) {
        return null;
    }
    delete value._id;
    return (0, activitypub_core_utilities_1.convertStringsToUrls)(value);
}
exports.findOne = findOne;
//# sourceMappingURL=findOne.js.map