"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItem = exports.insertItem = exports.removeOrderedItem = exports.insertOrderedItem = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function insertOrderedItem(path, url) {
    const collectionName = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(path);
    await this.db.collection(collectionName).updateOne({
        _id: path.toString(),
    }, {
        $inc: {
            totalItems: 1,
        },
        $push: {
            orderedItems: {
                $each: [url.toString()],
                $position: 0,
            },
        },
    }, {
        upsert: true,
    });
}
exports.insertOrderedItem = insertOrderedItem;
async function removeOrderedItem(path, url) {
    const collectionName = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(path);
    await this.db.collection(collectionName).updateOne({
        _id: path.toString(),
    }, {
        $inc: {
            totalItems: -1,
        },
        $pull: {
            orderedItems: url.toString(),
        },
    }, {
        upsert: true,
    });
}
exports.removeOrderedItem = removeOrderedItem;
async function insertItem(path, url) {
    const collectionName = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(path);
    await this.db.collection(collectionName).updateOne({
        _id: path.toString(),
    }, {
        $inc: {
            totalItems: 1,
        },
        $push: {
            items: {
                $each: [url.toString()],
            },
        },
    }, {
        upsert: true,
    });
}
exports.insertItem = insertItem;
async function removeItem(path, url) {
    const collectionName = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(path);
    await this.db.collection(collectionName).updateOne({
        _id: path.toString(),
    }, {
        $inc: {
            totalItems: -1,
        },
        $pull: {
            items: url.toString(),
        },
    }, {
        upsert: true,
    });
}
exports.removeItem = removeItem;
//# sourceMappingURL=insert.js.map