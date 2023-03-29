"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = void 0;
async function findAll(collection, matchingObject) {
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