"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItem = exports.insertItem = exports.removeOrderedItem = exports.insertOrderedItem = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const mongodb_1 = require("mongodb");
async function insertOrderedItem(path, url) {
    if (!(this.db instanceof mongodb_1.Db)) {
        throw new Error('Bad database.');
    }
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
    if (!(this.db instanceof mongodb_1.Db)) {
        throw new Error('Bad database.');
    }
    const collectionName = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(path);
    const existingItem = this.findOne(collectionName, {
        _id: path.toString(),
        orderedItems: [url.toString()],
    });
    if (!existingItem) {
        return;
    }
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
    if (!(this.db instanceof mongodb_1.Db)) {
        throw new Error('Bad database.');
    }
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
    if (!(this.db instanceof mongodb_1.Db)) {
        throw new Error('Bad database.');
    }
    const collectionName = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(path);
    const existingItem = this.findOne(collectionName, {
        _id: path.toString(),
        items: [url.toString()],
    });
    if (!existingItem) {
        return;
    }
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