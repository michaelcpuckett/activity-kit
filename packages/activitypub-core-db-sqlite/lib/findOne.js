"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function findOne(collection, matchingObject, options) {
    const [key] = Object.keys(matchingObject);
    const [keyValue] = Object.values(matchingObject);
    const value = await this.db.get(`SELECT * FROM ${collection} WHERE ${key} = ?;`, keyValue);
    if (!value) {
        return null;
    }
    if ('_id' in value && value._id) {
        delete value._id;
    }
    for (const key of Object.keys(value)) {
        if (value[key] === null) {
            delete value[key];
        }
        else if (typeof value[key] === 'string' &&
            value[key].startsWith('JSON:')) {
            value[key] = JSON.parse(value[key].slice('JSON:'.length));
        }
    }
    return (0, activitypub_core_utilities_1.convertStringsToUrls)(value);
}
exports.findOne = findOne;
//# sourceMappingURL=findOne.js.map