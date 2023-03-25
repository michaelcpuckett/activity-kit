"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItem = exports.insertItem = exports.removeOrderedItem = exports.insertOrderedItem = void 0;
async function insertOrderedItem(path, url) {
    const currentRecord = (await this.findEntityById(path));
    const originalItems = currentRecord?.orderedItems ?? [];
    await this.saveEntity({
        ...currentRecord,
        totalItems: (currentRecord?.totalItems ?? 0) + 1,
        orderedItems: [url, ...originalItems],
    });
}
exports.insertOrderedItem = insertOrderedItem;
async function removeOrderedItem(path, url) {
    const currentRecord = (await this.findEntityById(path));
    const originalItems = currentRecord?.orderedItems ?? [];
    if (!originalItems.map((item) => item.toString()).includes(url.toString())) {
        return;
    }
    await this.saveEntity({
        ...currentRecord,
        totalItems: currentRecord.totalItems - 1,
        orderedItems: originalItems
            .map((item) => item.toString())
            .filter((item) => item !== url.toString())
            .map((item) => new URL(item)),
    });
}
exports.removeOrderedItem = removeOrderedItem;
async function insertItem(path, url) {
    const currentRecord = (await this.findEntityById(path));
    const originalItems = currentRecord?.items ?? [];
    await this.saveEntity({
        ...currentRecord,
        totalItems: (currentRecord?.totalItems ?? 0) + 1,
        items: [url, ...originalItems],
    });
}
exports.insertItem = insertItem;
async function removeItem(path, url) {
    const currentRecord = (await this.findEntityById(path));
    const originalItems = currentRecord?.items ?? [];
    if (!originalItems.map((item) => item.toString()).includes(url.toString())) {
        return;
    }
    await this.saveEntity({
        ...currentRecord,
        totalItems: currentRecord.totalItems - 1,
        items: originalItems
            .map((item) => item.toString())
            .filter((item) => item !== url.toString())
            .map((item) => new URL(item)),
    });
}
exports.removeItem = removeItem;
//# sourceMappingURL=insert.js.map