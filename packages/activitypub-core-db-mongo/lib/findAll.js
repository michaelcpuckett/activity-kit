"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = void 0;
async function findAll(collection, matchingObject) {
    const cursor = this.db
        .collection(collection)
        .find(matchingObject, { projection: { _id: 0 } });
    const value = await cursor.toArray();
    if (!value) {
        return null;
    }
    return value;
}
exports.findAll = findAll;
//# sourceMappingURL=findAll.js.map