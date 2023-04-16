"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = void 0;
const mongodb_1 = require("mongodb");
async function findAll(collection, matchingObject) {
    if (!(this.db instanceof mongodb_1.Db)) {
        throw new Error('Bad database.');
    }
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