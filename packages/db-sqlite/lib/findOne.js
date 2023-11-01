"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function findOne(collection, matchingObject, options) {
    const [key] = Object.keys(matchingObject);
    const [keyValue] = Object.values(matchingObject);
    const value = await this.db.get(`SELECT * FROM ${collection} WHERE ${key} = ?${options && options.includes(types_1.DbOptions.CASE_INSENSITIVE)
        ? ' COLLATE NOCASE'
        : ''};`, keyValue);
    if (!value) {
        return null;
    }
    if ('_id' in value && value._id) {
        delete value._id;
    }
    for (const key of Object.keys(value)) {
        // All fields come back, even if they are null.
        if (value[key] === null) {
            delete value[key];
        }
        else if (['manuallyApprovesFollowers', 'sensitive'].includes(key)) {
            // Convert from number (INTEGER) to boolean.
            value[key] = value[key] === 1 ? true : false;
        }
        else if (typeof value[key] === 'string' &&
            value[key].startsWith('JSON:')) {
            // Convert to object when prefixed with 'JSON:'.
            value[key] = JSON.parse(value[key].slice('JSON:'.length));
        }
    }
    return (0, utilities_1.convertJsonToEntity)(value);
}
exports.findOne = findOne;
//# sourceMappingURL=findOne.js.map