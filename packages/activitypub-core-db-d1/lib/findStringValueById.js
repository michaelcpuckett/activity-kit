"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStringValueById = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
function assertHasValueKey(value) {
    (0, activitypub_core_types_1.assertIsObject)(value);
    if (!('value' in value)) {
        throw new Error('Missing value key');
    }
}
async function findStringValueById(dbCollection, _id) {
    const one = await this.db
        .prepare(`SELECT * FROM ${dbCollection} WHERE _id = ?;`)
        .bind(_id)
        .first();
    if (!one) {
        return '';
    }
    try {
        assertHasValueKey(one);
    }
    catch (error) {
        return '';
    }
    if (!('value' in one) || typeof one.value !== 'string') {
        return '';
    }
    return one.value;
}
exports.findStringValueById = findStringValueById;
//# sourceMappingURL=findStringValueById.js.map