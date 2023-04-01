"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStringIdByValue = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const workers_types_1 = require("@cloudflare/workers-types");
function assertHasIdKey(value) {
    (0, activitypub_core_types_1.assertIsObject)(value);
    if (!('_id' in value)) {
        throw new Error('Missing ID key');
    }
}
async function findStringIdByValue(dbCollection, value) {
    if (!(this.db instanceof workers_types_1.D1Database)) {
        throw new Error('Bad database type.');
    }
    const one = await this.db
        .prepare(`SELECT * FROM ${dbCollection} WHERE value = ?;`)
        .bind(value)
        .first();
    if (!one) {
        return '';
    }
    try {
        assertHasIdKey(one);
    }
    catch (error) {
        return '';
    }
    if (!('_id' in one) || typeof one._id !== 'string') {
        return '';
    }
    return one._id;
}
exports.findStringIdByValue = findStringIdByValue;
//# sourceMappingURL=findStringIdByValue.js.map