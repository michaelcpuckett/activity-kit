"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = void 0;
const workers_types_1 = require("@cloudflare/workers-types");
async function findAll(collection, matchingObject) {
    if (!(this.db instanceof workers_types_1.D1Database)) {
        throw new Error('Bad database type.');
    }
    const [key] = Object.keys(matchingObject);
    const [keyValue] = Object.values(matchingObject);
    const { results: value } = await this.db
        .prepare(`SELECT * FROM ${collection}${key ? ` WHERE ${key} = ?` : ''};`)
        .bind(keyValue)
        .all();
    if (!value) {
        return null;
    }
    return value;
}
exports.findAll = findAll;
//# sourceMappingURL=findAll.js.map