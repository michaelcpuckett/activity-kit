"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = void 0;
async function findAll(collection, matchingObject) {
    const [key] = Object.keys(matchingObject);
    const [keyValue] = Object.values(matchingObject);
    const value = await this.db.all.apply(this.db, [
        `SELECT * FROM ${collection}${key ? ` WHERE ${key} = ?` : ''};`,
        ...(keyValue ? [keyValue] : []),
    ]);
    if (!value) {
        return null;
    }
    return value;
}
exports.findAll = findAll;
//# sourceMappingURL=findAll.js.map