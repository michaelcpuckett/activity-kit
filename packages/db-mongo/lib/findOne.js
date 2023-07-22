"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = void 0;
const core_1 = require("@activity-kit/core");
const utilities_1 = require("@activity-kit/utilities");
const mongodb_1 = require("mongodb");
async function findOne(collection, matchingObject, options) {
    if (!(this.db instanceof mongodb_1.Db)) {
        throw new Error('Bad database.');
    }
    let value = null;
    if (options && options.includes(core_1.DbOptions.CASE_INSENSITIVE)) {
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
    return (0, utilities_1.convertJsonToEntity)(value);
}
exports.findOne = findOne;
//# sourceMappingURL=findOne.js.map