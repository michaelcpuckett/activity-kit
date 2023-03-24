"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItem = exports.insertItem = exports.removeOrderedItem = exports.insertOrderedItem = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function insertOrderedItem(path, url) {
    const collectionName = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(path);
    const currentRecord = await this.db.get(`SELECT * FROM ${collectionName} WHERE _id = ?;`, path.toString());
    await this.db.run(`UPDATE ${collectionName} WHERE _id = ${path.toString()} VALUES (?);`, {
        ...currentRecord,
        totalItems: currentRecord.totalItems + 1,
        orderedItems: [url.toString(), ...currentRecord.orderedItems],
    });
}
exports.insertOrderedItem = insertOrderedItem;
async function removeOrderedItem(path, url) {
    const collectionName = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(path);
    const currentRecord = await this.db.get(`SELECT * FROM ${collectionName} WHERE _id = ?;`, path.toString());
    if (!currentRecord.items.includes(url.toString())) {
        return;
    }
    await this.db.run(`UPDATE ${collectionName} WHERE _id = ${path.toString()} VALUES (?);`, {
        ...currentRecord,
        totalItems: currentRecord.totalItems - 1,
        items: currentRecord.items.filter((item) => item !== url.toString()),
    });
}
exports.removeOrderedItem = removeOrderedItem;
async function insertItem(path, url) {
    const collectionName = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(path);
    const currentRecord = await this.db.get(`SELECT * FROM ${collectionName} WHERE _id = ?;`, path.toString());
    await this.db.run(`UPDATE ${collectionName} WHERE _id = ${path.toString()} VALUES (?);`, {
        ...currentRecord,
        totalItems: currentRecord.totalItems + 1,
        items: [url.toString(), ...currentRecord.items],
    });
}
exports.insertItem = insertItem;
async function removeItem(path, url) {
    const collectionName = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(path);
    const currentRecord = await this.db.get(`SELECT * FROM ${collectionName} WHERE _id = ?;`, path.toString());
    if (!currentRecord.items.includes(url.toString())) {
        return;
    }
    await this.db.run(`UPDATE ${collectionName} WHERE _id = ${path.toString()} VALUES (?);`, {
        ...currentRecord,
        totalItems: currentRecord.totalItems - 1,
        items: currentRecord.items.filter((item) => item !== url.toString()),
    });
}
exports.removeItem = removeItem;
//# sourceMappingURL=insert.js.map